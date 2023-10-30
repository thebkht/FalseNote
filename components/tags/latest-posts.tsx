"use client"
import { useSession } from "next-auth/react";
import FeedPostCard from "../blog/feed-post-card";
import TagPostCard from "./post-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Separator } from "../ui/separator";

export default function TagLatestPosts({ posts, tag }: { posts: any, tag: any }) {
     const { status: sessionStatus } = useSession();
     if (sessionStatus !== "authenticated") return null;
     const firstTwoPosts = posts.slice(0, 2);
     const restPosts = posts.slice(2, posts.length);
     return (
          <div className="flex justify-center">
               <div className="mx-6 mb-20 w-full">
                    <div className="flex justify-between">
                         <div className="min-w-80">
                              <h2 className="text-2xl font-medium tracking-tight w-full capitalize">Latest posts</h2>
                         </div>
                         <div className="flex flex-col max-w-[780px]">
                              <div className="space-y-4">
                              {
                                   posts.map((post: any) => (
                                        <FeedPostCard key={post.id} post={post} />
                                   ))
                              }
                              </div>
                              <Separator />
                              <div className="mt-20">
                                   <Button variant={"outline"} size={"lg"}>
                                        <Link href={`/tag/${tag.name}/posts`}>
                                             See more posts
                                        </Link>
                                   </Button>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}