"use client"
import { useSession } from "next-auth/react";
import FeedPostCard from "../blog/feed-post-card";
import TagPostCard from "./post-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TagPopularPosts({ posts: initialPosts, tag, session }: { posts: any, tag: any, session: any }) {
     const [posts, setPosts] = useState<Array<any>>(initialPosts);
     useEffect(() => {
          setPosts(initialPosts)
     }, [initialPosts])
     const { status: sessionStatus } = useSession();
     if (sessionStatus !== "authenticated") return null;
     const firstTwoPosts = posts.slice(0, 2);
     const restPosts = posts.slice(2, posts.length);
     return (
          <div className="flex justify-center">
               <div className="mx-6 mb-20">
                    <div className="my-10">
                         <h2 className="text-2xl font-medium tracking-tight w-full capitalize">Popular posts</h2>
                    </div>
                    <div className="grid md:grid-cols-6 gap-10">
                         {firstTwoPosts.map((post: any) => (
                              <TagPostCard key={post.id} post={post} session={session} className="md:col-span-3  col-span-6" />
                         ))}
                         {restPosts.map((post: any) => (
                              <TagPostCard key={post.id} post={post} session={session} className="lg:col-span-2 md:col-span-3 col-span-6" />
                         ))}
                    </div>
                    <div className="mt-20">
                         <Button variant={"outline"} size={"lg"} asChild>
                              <Link href={`/tag/${tag.name}/popular`}>
                                   See more popular posts
                              </Link>
                         </Button>
                    </div>
               </div>
          </div>
     )
}