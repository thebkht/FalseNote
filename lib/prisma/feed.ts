import { getSessionUser } from "@/components/get-session-user";
import postgres from "../postgres";

export const getFeed = async ({
  page = 0,
  tag,
}: {
  page?: number;
  tag?: string | undefined;
}) => {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }
  console.log(user);
  const { id } = user;
  console.log(id);
  console.log(tag);
  try {
    if (tag) {
      const feed = await postgres.post.findMany({
        where: {
          id: {
            in: (
              await postgres.postTag.findMany({
                select: {
                  postId: true,
                },
                where: {
                  tag: {
                    name: {
                      equals: tag,
                    },
                  },
                },
              })
            ).map((postTag) => postTag.postId),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        skip: page * 5,
        include: {
          author: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
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
      });
      return { feed: JSON.parse(JSON.stringify(feed)) };
    } else {
      const feed = await postgres.post.findMany({
        where: {
          authorId: {
            in: (
              await postgres.follow.findMany({
                select: {
                  followingId: true,
                },
                where: {
                  followerId: id,
                },
              })
            ).map((user) => user.followingId),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        skip: page * 5,
        include: {
          author: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
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
      });

      return { feed: JSON.parse(JSON.stringify(feed)) };
    }
  } catch (error) {
    return { error };
  }
};
