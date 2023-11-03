import { getSessionUser } from "@/components/get-session-user";
import postgres from "../postgres";
import { Prisma } from "@prisma/client";

const baseQuery = {
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
            visibility: "public",
          }
        : { visibility: "public" },
    take: limit,
    skip: page * limit,
    orderBy: {
     views: "desc" as const,
   },
  });
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
     id: number;
   }) => {
     const mainQuery = search !== undefined ? {
       ...whereQuery,
       title: {
         contains: search,
         mode: "insensitive",
       },
     } : { ...whereQuery };
     const posts = await postgres.post.findMany({
          ...baseQuery,
          where: {...mainQuery, authorId: id},
          take: limit,
          skip: page * limit,
          orderBy: {
               createdAt: "desc",
          }
     });
     return { posts: JSON.parse(JSON.stringify(posts)) };
   };
