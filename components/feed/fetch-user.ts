import postgres from "@/lib/postgres";
import { getSessionUser } from "../get-session-user";
import { getFollowings } from "@/lib/prisma/session";

export const fetchUsers = async ({id, limit = 3} : {id?: string | undefined, limit?: number}) => {

  const topUsers = await postgres.user.findMany({
    include: {
      Followers: true,
      Followings: true,
    },
    take: limit,
    where: id ? {
      id: {
        not: id,
      },
      Followers: {
        none: {
          followerId: id,
        },
      },
    } : {},
    orderBy: {
      Followers: {
        _count: "desc",
      },
    },
  });

  return { users: JSON.parse(JSON.stringify(topUsers)) };
};