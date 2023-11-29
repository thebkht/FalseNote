"use client"
import { useSession } from "next-auth/react";
import FeedPostCard from "../blog/feed-post-card";
import TagPostCard from "./post-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserVerticalCard from "../user-vertical-card";

export default function TagFollowers({ followers: initialFollowers, tag, session }: { followers: any, tag: any, session: any }) {
     const [followers, setFollowers] = useState<Array<any>>(initialFollowers);
     useEffect(() => {
          setFollowers(initialFollowers)
     }, [initialFollowers])
     
     return (
          <div className="flex justify-center w-full">
               <div className="mb-20 w-full">
                    <div className="my-10">
                         <h2 className="text-2xl font-medium tracking-tight w-full">Who to follow</h2>
                    </div>
                    <div className="mt-6 mb-10">
                         <div className="flex md:grid md:grid-cols-5 py-0.5 items-center gap-6 justify-between">
                              {
                                   followers.map((follower: any) => (
                                        <UserVerticalCard key={follower.id} user={follower.follower} session={session} />
                                   ))
                              }
                         </div>
                    </div>
                    {/* <div className="mt-20">
                         <Button variant={"outline"} size={"lg"} asChild>
                              <Link href={`/tag/${tag.name}/popular`}>
                                   See more popular posts
                              </Link>
                         </Button>
                    </div> */}
               </div>
          </div>
     )
}