import { config } from '@/app/auth'
import postgres from '@/lib/postgres'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

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

  if (tag) {
    const postTags = await postgres.postTag.findMany({
      select: { postId: true },
      where: { tag: { name: { equals: tag } } },
    });
    const postIds = postTags.map((postTag) => postTag.postId);
    return fetchFeed({
      ...baseQuery,
      where: { id: { in: postIds }, visibility: "public" },
    });
  } else {
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