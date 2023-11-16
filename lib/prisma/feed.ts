import { getSessionUser } from "@/components/get-session-user";
import postgres from "../postgres";

const getLikes = async ({ id }: { id: number | undefined }) => {
  const likes = await postgres.like.findMany({
    where: { authorId: id },
    select: {
      postId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return { likes: JSON.parse(JSON.stringify(likes)) };
}

const getBookmarks = async ({ id }: { id: number | undefined }) => {
  const bookmarks = await postgres.bookmark.findMany({
    where: { userId: id },
    select: {
      postId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return { bookmarks: JSON.parse(JSON.stringify(bookmarks)) };
}

const getHistory = async ({ id }: { id: number | undefined }) => {
  const history = await postgres.readingHistory.findMany({
    where: { userId: id },
    select: {
      postId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return { history: JSON.parse(JSON.stringify(history)) };
}

const baseQuery = {
  orderBy: { createdAt: "desc" },
  select: {
    id: true,
    title: true,
    subtitle: true,
    url: true,
    cover: true,
    visibility: true,
    createdAt: true,
    updatedAt: true,
    readingTime: true,
    author: {
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        verified: true,
        falsemember: true,
        createdAt: true,
        Followers: true,
        Followings: true,
      },
    },
    savedUsers: { select: { userId: true } },
    _count: {
      select: {
        likes: true,
        savedUsers: true,
      },
    },
    tags: {
      take: 1,
      select: {
        tag: true
      }
    },
  },
};

export const getForYou = async ({ page = 0, limit = 10 }: { page?: number, limit?: number | undefined}) => {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }
  const { id } = user;

  //get user's interests
  const [{ likes: userLikes }, { bookmarks: userBookmarks }, { history: userHistory }] = await Promise.all([
    getLikes({id}),
    getBookmarks({id}),
    getHistory({id})
  ]);

  // Fetch the tags of the posts in parallel
  const tags = await postgres.postTag.findMany({
    where: {
      postId: {
        in: [
          ...userLikes.map((like: any) => like.postId),
          ...userBookmarks.map((bookmark: any) => bookmark.postId),
          ...userHistory.map((history: any) => history.postId),
        ],
      },
    },
    select: {
      tagId: true,
    },
  });

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

// remove duplicates
const uniquePosts = posts.filter((post, index) => posts.findIndex((p) => p.id === post.id) === index);
return fetchFeed({
  where: { id: { in: uniquePosts.map((post) => post.id) }, visibility: "public" },
  ...baseQuery,
  take: Number(limit),
  skip: page * Number(limit),
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

export const getFeed = async ({ page = 0, tab, limit = 10 }: { page?: number | undefined; tab?: string | undefined, limit?: number | undefined }) => {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }
  const { id } = user;
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
        take: Number(limit),
        skip: page * Number(limit),
        where: { authorId: { in: followingIds }, visibility: "public" },
        select: {
          ...baseQuery.select,
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
      take: Number(limit),
      skip: page * Number(limit),
      where: { id: { in: postIds }, visibility: "public" },
    });
  } 
};