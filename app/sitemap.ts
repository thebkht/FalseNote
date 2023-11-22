import { headers } from "next/headers";
import { getPostsForSite } from "@/lib/fetchers";

export default async function Sitemap() {
  const headersList = headers();
  const domain = headersList
    .get("host")
    ?.replace(".localhost:3000", `.${process.env.DOMAIN}`);

  const posts = typeof domain === "string" ? await getPostsForSite(domain) : [];

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    ...posts.map(({ url, author }) => ({
      url: `https://${domain}/@${author.username}/${url}`,
      lastModified: new Date(),
    })),
  ];
}
