'use server'
import { getFeed } from "@/lib/prisma/feed";
import { getSessionUser } from "../get-session-user";

export const fetchFeed = async ({ page = 0, tag }: { page?: number, tag?: string | undefined }) => {
      const user = await getSessionUser();

      const result = await fetch(process.env.DOMAIN + "/api/feed", {
            method: "POST",
            body: JSON.stringify({ page, tag, id: user?.id }),
            headers: {
            "Content-Type": "application/json",
            },
            }).then((res) => res.json());
      
      return result?.feed;
}