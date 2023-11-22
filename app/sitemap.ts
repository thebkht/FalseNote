import { getPostsForSite } from "@/lib/fetchers";

export default async function Sitemap() {
  const domain = process.env.DOMAIN

  const posts = await getPostsForSite();

  return [
    {
      url: domain,
      lastModified: new Date(),
    },
    ...posts.map(({ url, author }) => ({
      url: `${domain}/@${author.username}/${url}`,
      lastModified: new Date(),
    })),
  ];
}
