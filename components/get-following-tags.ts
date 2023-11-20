import { getFollowingTags } from "@/lib/prisma/session";

export const fetchFollowingTags = async ({id} : {id: string | undefined}) => {
     const result = await getFollowingTags({id});
     if (result && result.followingTags) {
          return result.followingTags;
     }
     return [];
}
