import { getSessionUser } from "@/components/get-session-user";
import postgres from "../postgres";
import { Prisma } from "@prisma/client";

const baseQuery = {
  include: {
    author: {
      include: {
        Followers: true,
        Followings: true,
      },
    },
    savedUsers: true,
    _count: {
      select: {
        likes: true,
        savedUsers: true,
        readedUsers: true,
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

export const getPosts = async ({
  search,
  page = 0,
  limit = 10,
}: {
  search?: string | undefined;
  page?: number;
  limit?: number;
}) => {
  const posts = await postgres.post.findMany({
    ...baseQuery,
    where:
      search !== undefined
        ? {
            /* OR: [
                    {
                         title: {
                              contains: search,
                              mode: "insensitive",
                         },
                    },
                    {
                         content: {
                              contains: search,
                              mode: "insensitive",
                         },
                    },
               ], */
            title: {
              contains: search,
              mode: "insensitive",
            },
            published: true,
          }
        : { published: true },
    take: limit,
    skip: page * limit,
    orderBy: [
      {
        readedUsers: {
          _count: "desc",
        },
      },
      {
        savedUsers: {
          _count: "desc",
        },
      },
      {
        likes: {
          _count: "desc",
        },
      },
      {
        views: "desc",
      },
    ],
  });

  // // Sort the results in your application code
  // posts.sort((a, b) => {
  //   const aCount = a._count.likes + a._count.savedUsers + a._count.readedUsers;
  //   const bCount = b._count.likes + b._count.savedUsers + b._count.readedUsers;

  //   return bCount - aCount;
  // });

  return { posts: JSON.parse(JSON.stringify(posts)) };
};

export const getPost = async ({
  search,
  page = 0,
  limit = 10,
  whereQuery,
  id,
}: {
  search?: string | undefined;
  page?: number;
  limit?: number;
  whereQuery?: any;
  id: string | undefined;
}) => {
  const mainQuery =
    search !== undefined
      ? {
          ...whereQuery,
          title: {
            contains: search,
            mode: "insensitive",
          },
        }
      : { ...whereQuery };
  const posts = await postgres.post.findMany({
    ...baseQuery,
    where: { ...mainQuery, authorId: id },
    take: limit,
    skip: page * limit,
    orderBy: {
      createdAt: "desc",
    },
  });
  return { posts: JSON.parse(JSON.stringify(posts)) };
};
