"use client"
import { ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ContextMenu } from "../ui/context-menu";
import PostCard from "../blog/post-card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { get } from "http";
import FeedPostCard from "../blog/feed-post-card";

export default function UserPosts({ posts, className, user, sessionUser }: { posts: any, className?: string, user?: any, sessionUser?: any }) {
     const [deleted, setDeleted] = useState<boolean>(false);
     async function handleDelete(posturl: string) {
     await fetch(`/api/posts/${user?.username}?postid=${posturl}`, {
       method: "DELETE",
     });
     setDeleted(true);
   }

     const { status } = useSession();
     if (status !== "authenticated") return null;
     return (
          <div className={className}>
               <div className="user-articles py-4 md:px-8 space-y-6 w-full">
          {posts?.length > 0 ? (
            posts?.map((article: any) => (
                article.visibility === "public" &&
                  (
                    <ContextMenu key={article.id}>
                    <div className="space-y-3 md:space-y-6">
                    <ContextMenuTrigger className="">
                      
                      <FeedPostCard post={article} />
                      </ContextMenuTrigger>
                    <ContextMenuContent className="w-full">
                      {sessionUser?.id === user?.id ? (
                        <ContextMenuItem>
                        <Link href={`/editor/${article.url}`}>
                          Edit
                        </Link>
                        </ContextMenuItem>) : (  null )}
                      {sessionUser?.id === user?.id ? (
                        <ContextMenuItem onClick={() => handleDelete(article.postid)}>
                          Delete
                        </ContextMenuItem>) : (  null )}
                      <ContextMenuItem>Save</ContextMenuItem>
                      <ContextMenuItem>Share</ContextMenuItem>
                    </ContextMenuContent>
                    </div>
                  </ContextMenu>
                  )
            ))
          ) : (
            <p className="text-base font-light text-center py-5">This user has no posts</p>
          )}
        </div>
          </div>
     )
}