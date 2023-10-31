import { getSessionUser } from "@/components/get-session-user";
import postgres from "../postgres";

const fetchFeed = async (query: any) => {
  try {
    const feed = await postgres.post.findMany(query);
    return { feed: JSON.parse(JSON.stringify(feed)) };
  } catch (error) {
    return { error };
  }
};

export const getFeed = async ({ page = 0, tag }: { page?: number; tag?: string | undefined }) => {
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
      where: { id: { in: postIds } },
    });
  } else {
    const following = await postgres.follow.findMany({
      select: { followingId: true },
      where: { followerId: id },
    });
    const followingIds = following.map((user) => user.followingId);
    return fetchFeed({
      ...baseQuery,
      where: { authorId: { in: followingIds } },
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
};