"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import { formatNumberWithSuffix } from "../format-numbers";
import { getSessionUser } from "../get-session-user";
import { Button } from "../ui/button";

export default function TagDetails({tag, post, tagFollowers} : {tag: any, post: any, tagFollowers: any}) {
     const session = async () => {
          return await getSessionUser();
     };

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
       if (user) {
         const followerArray = Object.values(followersRef.current); // Convert object to array
         const followerFound = followerArray.find((follower: any) => {
           return follower.userid === user?.userid;
         });
   
         if (followerFound) {
           setIsFollowing(true);
         } else {
           setIsFollowing(false);
         }
       } else {
         setIsFollowing(false);
       }
     }, [session, tagFollowers]);
   
     useEffect(() => {
       followersRef.current = fetchFollowers() as any;
       const followerArray = Object.values(followersRef.current); // Convert object to array
       const followerFound = followerArray.find((follower: any) => {
         return follower.userid === user?.userid;
       });
   
       if (followerFound) {
         setIsFollowing(true);
       } else {
         setIsFollowing(false);
       }
     }, [tagFollowers, isFollowing, fetchFollowers]);

  const handleFollow = () => async () => {
     setIsFollowingLoading(true);
     // add to tagfollow table
     const userid = (await session()).userid;
     const response = await fetch(`/api/follow/tag?tagId=${tag.tagid}&userId=${userid}`, {
       method: "POST",
     });
     // if successful, update tag.followers and set isFollowing to true
     if (response.status === 200) {
       setIsFollowing(!isFollowing);
     }
     setIsFollowingLoading(false);
   };
     
     return (
          <>
          <div className="space-y-0.5 px-6 pb-14 w-full">
                         <h2 className="text-5xl font-medium tracking-tight w-full capitalize text-center">{tag.tagname}</h2>
                         <div className="text-muted-foreground pt-4 pb-6 flex justify-center">
                              Tag<div className="mx-2">·</div>{formatNumberWithSuffix(post)} Posts<div className="mx-2">·</div>{formatNumberWithSuffix(followersRef.current.length)} Followers
                         </div>
                         <div className="w-full flex justify-center">
                              <Button variant={"secondary"} size={"lg"} disabled={isFollowingLoading} onClick={handleFollow()}>{
                                   isFollowing ? "Following" : "Follow"
                              }</Button>
                         </div>
                    </div>
          </>
     )
}