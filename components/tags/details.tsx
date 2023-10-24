"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import { formatNumberWithSuffix } from "../format-numbers";
import { getSessionUser } from "../get-session-user";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import LoginDialog from "../login-dialog";
import { is } from "date-fns/locale";
import { revalidatePath } from "next/cache";

export default function TagDetails({ tag, post, tagFollowers }: { tag: any, post: any, tagFollowers: any }) {
     const session = async () => {
          return await getSessionUser();
     };

     const { status: sessionStatus } = useSession();

     const [isFollowing, setIsFollowing] = useState<boolean>(false);
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
     const user = session() as any;

     useEffect(() => {
          if (user) {
               tagFollowers.forEach((follower: any) => {
                    if (follower.userid === user.id) {
                         setIsFollowing(true);
                    }
               })
          }
     }, [user]);

     const handleFollow = () => async () => {
          if (sessionStatus === "authenticated") {
               setIsFollowingLoading(true);
               try {
                    setIsFollowing(!isFollowing);
                    const userid = (await session()).id;
                    const response = await fetch(`/api/follow/tag?tagId=${tag.id}&userId=${userid}`, {
                         method: "POST",
                    });
                    if (!response.ok) {
                         setIsFollowing(!isFollowing);
                    }
                    
                    setIsFollowingLoading(false);
               } catch (error) {
                    console.error(error);
                    setIsFollowingLoading(false);
               }
               revalidatePath(`/tag/${tag.name}`);
     } else {
          return null;
     };
     
     }

     return (
          <>
               <div className="space-y-0.5 px-6 pb-14 w-full">
                    <h2 className="text-5xl font-medium tracking-tight w-full capitalize text-center">{tag.name}</h2>
                    <div className="text-muted-foreground pt-4 pb-6 flex justify-center">
                         Tag<div className="mx-2">·</div>{formatNumberWithSuffix(post)} Posts<div className="mx-2">·</div>{formatNumberWithSuffix(tagFollowers.length)} Followers
                    </div>
                    <div className="w-full flex justify-center">
                         {
                              sessionStatus === "authenticated" ? (
                                   <Button variant={"secondary"} size={"lg"} disabled={isFollowingLoading} onClick={handleFollow()}>{
                                        isFollowing ? "Following" : "Follow" }
                                   </Button>
                              ) : (
                                   <LoginDialog>
                                        <Button variant={"secondary"} size={"lg"} disabled={isFollowingLoading}>Follow</Button>
                                   </LoginDialog>
                              )
                         }
                    </div>
               </div>
          </>
     )
}