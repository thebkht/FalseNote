'use server'
import { getFeed } from "@/lib/prisma/feed";
import { getSessionUser } from "../get-session-user";

export const fetchFeed = async ({ page = 0, tag }: { page?: number, tag?: string | undefined }) => {
      const user = await getSessionUser();

      const result = await getFeed({ page, tag });
      
      return result?.feed;
}