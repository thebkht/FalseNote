import { getSessionUser } from "@/components/get-session-user";
import postgres from "../postgres";
import { Prisma } from "@prisma/client";

const baseQuery = {
  include: {
     Followers: true,
     Followings: true,
  },
};

export const getUsers = async ({
  search,
  page = 0,
  limit = 10,
}: {
  search?: string | undefined;
  page?: number;
  limit?: number;
}) => {
  const users = await postgres.user.findMany({
    ...baseQuery,
    where:
      search !== undefined
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                username: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {},
    take: limit,
    skip: page * limit,
    orderBy: {
      Followers: {
        _count: "desc",
      },
    },
  });
  return { users: JSON.parse(JSON.stringify(users)) };
};