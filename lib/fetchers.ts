import { unstable_cache } from "next/cache";
import postgres from "./postgres";

export async function getPostsForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

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
    [`${domain}-posts`],
    {
      revalidate: 900,
      tags: [`${domain}-posts`],
    }
  )();
}
