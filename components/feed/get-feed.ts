import { getFeed } from "@/lib/prisma/feed";

export const fetchFeed = async ({ page = 0, tab, limit = 10 }: { page?: number, tab?: string | undefined, limit?: number | undefined }) => {
      const result = await getFeed({ page, tab, limit });
      return result?.feed;
}