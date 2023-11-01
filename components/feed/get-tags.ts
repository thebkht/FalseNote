import postgres from "@/lib/postgres";
import { getSessionUser } from "../get-session-user";
import { getPopularTags } from "@/lib/prisma/tags";

export const fetchTags = async (query?: string) => {
  try {
    const user = await getSessionUser();
    const { tags } = await getPopularTags({ id: user?.id });

    return tags;
  } catch (error) {
    return { error };
  }
};
