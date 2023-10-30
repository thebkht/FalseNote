import postgres from "@/lib/postgres";
import { getSessionUser } from "../get-session-user";

export const fetchUsers = async () => {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }
  const { id } = user;

  const userFollowings = await postgres.follow.findMany({
    select: {
      followingId: true,
    },
    where: {
      followerId: id,
    },
  });

  const topUsers = await postgres.user.findMany({
    include: {
      Followers: true,
      Followings: true,
      posts: true,
    },
    take: 3,
    where: {
      id: {
        not: id,
      },
      Followers: {
        none: {
          followerId: id,
        },
      },
    },
    orderBy: {
      Followers: {
        _count: "desc",
      },
    },
  });

  if (topUsers.length === 0) {
    return null;
  } else {
    return { topUsers: JSON.parse(JSON.stringify(topUsers)) };
  }
};
