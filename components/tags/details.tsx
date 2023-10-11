"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import { formatNumberWithSuffix } from "../format-numbers";
import { getSessionUser } from "../get-session-user";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import LoginDialog from "../login-dialog";

export default function TagDetails({ tag, post, tagFollowers }: { tag: any, post: any, tagFollowers: any }) {
     const session = async () => {
          return await getSessionUser();
     };

     const { status: sessionStatus } = useSession();

     const followersRef = useRef(tagFollowers); // Initialize it as an empty object

     const [isFollowing, setIsFollowing] = useState<boolean>(false);
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);

     const fetchFollowers = async () => {
          const data = await fetch(`/api/tags?tagId=${tag.tagid}`, {
               method: "GET",
          });
          const followers = await data.json();
          return followers.followers as any;
     };
     const user = session() as any;

     useEffect(() => {
          async function fetchData(followersRef: React.MutableRefObject<any>, user: any, status: string) {
            if (status === "authenticated") {
              const followerId = (await getSessionUser()).userid;
              const userFollowers = await fetch(`/api/tags?tagId=${tag.tagid}`);
              const followers = await userFollowers.json().then((res) => res.followers);
              followersRef.current = followers;
              setIsFollowing(followers.find((follower: any) => follower.userid === followerId));
            }
          }
          fetchData(followersRef, user, sessionStatus);
     }, [sessionStatus]);

     const handleFollow = () => async () => {
          if (sessionStatus === "authenticated") {
               setIsFollowingLoading(true);
               try {
                    setIsFollowing(!isFollowing);
                    const userid = (await session()).userid;
                    const response = await fetch(`/api/follow/tag?tagId=${tag.tagid}&userId=${userid}`, {
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
     } else {
          return null;
     };
     }

     return (
          <>
               <div className="space-y-0.5 px-6 pb-14 w-full">
                    <h2 className="text-5xl font-medium tracking-tight w-full capitalize text-center">{tag.tagname}</h2>
                    <div className="text-muted-foreground pt-4 pb-6 flex justify-center">
                         Tag<div className="mx-2">·</div>{formatNumberWithSuffix(post)} Posts<div className="mx-2">·</div>{formatNumberWithSuffix(followersRef.current.length)} Followers
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