import postgres from "@/lib/postgres";
import { getSessionUser } from "../get-session-user";

export const fetchPosts = async () => {
  try {
     const user = await getSessionUser();
     if (!user) {
          return null;
     }
     const userid = user.id;
     const topUsers = await postgres.user.findMany({
          include: {
            Followers: true,
            Followings: true,
            posts: true,
          },
          take: 5,
          where: {
            id: {
              not: userid,
            },
            Followings: {
              none: {
                followerId: userid,
              },
            },
          },
          orderBy: {
            Followers: {
              _count: 'desc',
            },
          },
        });

    await new Promise((resolve) => setTimeout(resolve, 750));

    // return json from array
     return { user: JSON.parse(JSON.stringify(topUsers))}
  } catch (error) {
    return { error };
  }
}