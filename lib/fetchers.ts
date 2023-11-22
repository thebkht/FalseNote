import { unstable_cache } from "next/cache";
import postgres from "./postgres";

export async function getPostsForSite() {
  return await unstable_cache(
    async () => {
      return postgres.post.findMany({
        where: {
          visibility: "public",
        },
        select: {
          title: true,
          subtitle: true,
          url: true,
          cover: true,
          createdAt: true,
          author: {
            select: {
              username: true,
            },
          },
          updatedAt: true,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    },
    [`$posts`],
    {
      revalidate: 900,
      tags: [`$posts`],
    }
  )();
}
