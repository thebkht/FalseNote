import postgres from "@/lib/postgres";
import { getSessionUser } from "../get-session-user";
import { getFollowings } from "@/lib/prisma/session";

export const fetchUsers = async ({id} : {id: number | undefined}) => {

  const topUsers = await postgres.user.findMany({
    include: {
      Followers: true,
      Followings: true,
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
