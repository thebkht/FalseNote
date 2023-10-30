'use server'
import { getFeed } from "@/lib/prisma/feed";
import { getSessionUser } from "../get-session-user";

export const fetchFeed = async ({ page = 0, tag }: { page?: number, tag?: string | undefined }) => {
      const user = await getSessionUser();

      if (!user) {
            return null;
      } else {
            if (tag) {
                  const result = await fetch(process.env.DOMAIN + "/api/feed?page=" + page + "?tag=" + "?id=" + user?.id , {
                        method: "GET",
                        },
                        ).then((res) => res.json());
                  
                  return result?.feed;
            } else {
                  const result = await fetch(process.env.DOMAIN + "/api/feed?page=" + page + "?id=" + user?.id , {
                        method: "GET",
                        },
                        ).then((res) => res.json());
                  
                  return result?.feed;
            }
      }
}