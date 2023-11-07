import { getFeed } from "@/lib/prisma/feed";

export const fetchFeed = async ({ page = 0, tab }: { page?: number, tab?: string | undefined }) => {
      const result = await getFeed({ page, tab });
      return result?.feed;
}