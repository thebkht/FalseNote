import { config } from '@/app/auth'
import { getSessionUser } from '@/components/get-session-user';
import postgres from '@/lib/postgres'
import { getBookmarks, getHistory, getLikes } from '@/lib/prisma/session';
import { Like } from '@prisma/client';
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

const getForYou = async ({ page = 0 }: { page?: number }) => {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }
  const { id } = user;

  //get user's interests
  const { likes: userLikes } = await getLikes({id});
  const { bookmarks: userBookmarks } = await getBookmarks({id});
  const { history: userHistory } = await getHistory({id});

  // Fetch the tags of the posts in parallel
const tags = await postgres.postTag.findMany({
  where: {
    OR: [
      { postId: { in: userLikes.map((like: Like) => like.postId) } },
      { postId: { in: userBookmarks.map((bookmark: any) => bookmark.postId) } },
      { postId: { in: userHistory.map((history: any) => history.postId) } },
    ]
  },
  select: {
    tagId: true,
  },
});

const baseQuery = {
  orderBy: { createdAt: "desc" },
  take: 5,
  skip: page * 5,
  include: {
    author: true,
    savedUsers: true,
    _count: {
      select: {
        likes: true,
        savedUsers: true,
      },
    },
    tags: {
      take: 1,
      include: {
        tag: true,
      },
    },
  },
};

// Count the occurrences of each tag
const tagCounts = tags.reduce((counts, tag) => {
  counts[tag.tagId] = (counts[tag.tagId] || 0) + 1;
  return counts;
}, {} as Record<string, number>);

// Sort the tags by their count in descending order
const sortedTagIds = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tagId]) => Number(tagId));

const posts = await postgres.post.findMany({
  where: { tags: { some: { tagId: { in: sortedTagIds.slice(0, 5) } } } },
  select: { id: true },
});
return fetchFeed({
  where: { id: { in: posts.map((post) => post.id) }, visibility: "public" },
  ...baseQuery,
});
};

export async function GET(req: NextRequest) {
  const pageString = req.nextUrl.searchParams.get('page') || 0
  const page = Number(pageString)
  const tag = req.nextUrl.searchParams.get('tag')
  const session = await getServerSession(config)
  if (!session) {
    return NextResponse.json({ error: 'No user found' }, { status: 500 })
  }
  const user = session?.user
  const res = await postgres.user.findFirst({
    where: { image: user?.image },
    select: { id: true },
  })
  const id = res?.id
  if (!id) {
    return NextResponse.json({ error: 'No user found' }, { status: 500 })
  }
  const baseQuery = {
    orderBy: { createdAt: "desc" },
    take: 5,
    skip: page * 5,
    include: {
      author: true,
      savedUsers: true,
      _count: {
        select: {
          likes: true,
          savedUsers: true,
        },
      },
      tags: {
        take: 1,
        include: {
          tag: true,
        },
      },
    },
  };

  if (!tag) {
    return await getForYou({ page });
  }

  if (tag) {
    if (tag == "following") {
      const following = await postgres.follow.findMany({
        select: { followingId: true },
        where: { followerId: id },
      });
      const followingIds = following.map((user) => user.followingId);
      return fetchFeed({
        ...baseQuery,
        where: { authorId: { in: followingIds }, visibility: "public" },
        include: {
          ...baseQuery.include,
          author: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
        },
      });
    }
    const postTags = await postgres.postTag.findMany({
      select: { postId: true },
      where: { tag: { name: { equals: tag } } },
    });
    const postIds = postTags.map((postTag) => postTag.postId);
    return fetchFeed({
      ...baseQuery,
      where: { id: { in: postIds }, visibility: "public" },
    });
  } 
}

const fetchFeed = async (query: any) => {
  try {
    const feed = await postgres.post.findMany(query);
    console.log(feed)
    return NextResponse.json({ feed: feed}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};