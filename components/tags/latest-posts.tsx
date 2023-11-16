"use client"
import { useSession } from "next-auth/react";
import FeedPostCard from "../blog/feed-post-card";
import PostCard from "./post-card-v2";
import { Button } from "../ui/button";
import Link from "next/link";
import { Separator } from "../ui/separator";

export default function TagLatestPosts({ posts, tag, session }: { posts: any, tag: any, session: any }) {
     return (
          <div className="flex justify-center">
               <div className="mx-6 mb-20 w-full">
                    <div className="flex justify-between flex-col xl:flex-row">
                         <div className="min-w-80">
                              <h2 className="text-2xl font-medium tracking-tight w-full capitalize">Latest posts</h2>
                         </div>
                         <div className="flex flex-col xl:max-w-[780px]">
                              <div className="divide-y">
                                   {
                                        posts.map((post: any) => (
                                             <>
                                                  <PostCard key={post.id} post={post} session={session} />
                                                  <Separator />
                                             </>
                                        ))
                                   }
                              </div>
                              {/* <div className="mt-14">
                                   <Button variant={"outline"} size={"lg"}>
                                        <Link href={`/tag/${tag.name}/posts`}>
                                             See more posts
                                        </Link>
                                   </Button>
                              </div> */}
                         </div>
                    </div>
               </div>
          </div>
     )
}