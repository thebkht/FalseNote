import { getSessionUser } from "@/components/get-session-user";
import postgres from "../postgres";
import { getBookmarks, getHistory, getLikes } from "./session";
import { Like } from "@prisma/client";

export const getForYou = async ({ page = 0 }: { page?: number }) => {
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

const fetchFeed = async (query: any) => {
  try {
    const feed = await postgres.post.findMany(query);
    return { feed: JSON.parse(JSON.stringify(feed)) };
  } catch (error) {
    return { error };
  }
};

export const getFeed = async ({ page = 0, tab }: { page?: number; tab?: string | undefined }) => {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }
  const { id } = user;

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
  if (!tab) {
    return await getForYou({ page });
  }

  if (tab) {
    if (tab == "following") {
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
      where: { tag: { name: { equals: tab } } },
    });
    const postIds = postTags.map((postTag) => postTag.postId);
    return fetchFeed({
      ...baseQuery,
      where: { id: { in: postIds }, visibility: "public" },
    });
  } 
};