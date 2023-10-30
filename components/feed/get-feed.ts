'use server'
import postgres from "@/lib/postgres";
import { getSessionUser } from "../get-session-user";
import { getFeed } from "@/lib/prisma/feed";

export const fetchFeed = async ({ page = 0, tag }: { page?: number, tag?: string | undefined }) => {
      const result = await getFeed({ page, tag });
      
      return result?.feed;
}