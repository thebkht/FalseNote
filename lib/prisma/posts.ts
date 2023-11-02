import postgres from "../postgres";

const baseQuery = {
  orderBy: {
     views: "desc" as const,
  },
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
          where: search !== undefined ? {
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
          } : { visibility: "public" },
          take: limit,
          skip: page * limit,
     });
        return { posts: JSON.parse(JSON.stringify(posts)) };
   };