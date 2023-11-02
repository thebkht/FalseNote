"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import { formatNumberWithSuffix } from "../format-numbers";
import { getSessionUser } from "../get-session-user";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import LoginDialog from "../login-dialog";
import { is } from "date-fns/locale";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

export default function TagDetails({ tag, tagFollowers, session }: { tag: any, tagFollowers: any, session: any }) {
     const router = useRouter();

     const { status: sessionStatus } = useSession();

     const [isFollowing, setIsFollowing] = useState<boolean>(tagFollowers.find((user: any) => user.followerId === session.id));
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);

     useEffect(() => {
          setIsFollowing(tagFollowers.find((user: any) => user.followerId === session.id));
     }, [tagFollowers, session]);

     const handleFollow = () => async () => {
          if (sessionStatus === "authenticated") {
               setIsFollowingLoading(true);
               try {
                    setIsFollowing(!isFollowing);
                    const response = await fetch(`/api/follow/tag?tagId=${tag.id}&userId=${session.id}`, {
                         method: "GET",
                    });
                    if (!response.ok) {
                         setIsFollowing(!isFollowing);
                    }
                    setIsFollowingLoading(false);
               } catch (error) {
                    console.error(error);
                    setIsFollowingLoading(false);
               }
               await fetch(`/api/revalidate?path=/tag/${tag.name}`, {
                    method: "GET",
                    });
               router.refresh();
     }
     
     }

     return (
          <>
               <div className="space-y-0.5 px-6 pb-14 w-full">
                    <h2 className="text-5xl font-medium tracking-tight w-full capitalize text-center">{tag.name.replace(/-/g, " ")}</h2>
                    <div className="text-muted-foreground pt-4 pb-6 flex justify-center">
                         Tag<div className="mx-2">·</div>{formatNumberWithSuffix(tag._count.posts)} Posts<div className="mx-2">·</div>{formatNumberWithSuffix(tagFollowers.length)} Followers
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