"use client"
import { ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@radix-ui/react-context-menu";
import { ContextMenu } from "../ui/context-menu";
import PostCard from "../blog/post-card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import { useSession } from "next-auth/react";
import { useState } from "react";
import UserPostCard from "./post-card";

export default function UserPosts({ posts, className, user, sessionUser }: { posts: any, className?: string, user?: any, sessionUser?: any }) {
     const [deleted, setDeleted] = useState<boolean>(false);
     async function handleDelete(posturl: string) {
     await fetch(`/api/posts/${user?.username}?postid=${posturl}`, {
       method: "DELETE",
     });
     setDeleted(true);
   }

     const { data: session } = useSession();
     return (
          <div className={className}>
               <div className="user-articles py-4 md:px-8 space-y-6">
          {posts?.length > 0 ? (
            posts?.map((article: any) => (
                article.visibility === "public" &&
                  (
                    <ContextMenu key={article.postid}>
                    <div className="space-y-3 md:space-y-6">
                    <ContextMenuTrigger className="">
                      <UserPostCard post={article} user={user} sessionUser={sessionUser} />
                      </ContextMenuTrigger>
                    <ContextMenuContent>
                      {session?.user?.name === user?.name || session?.user?.name === user?.username ? (
                        <ContextMenuItem>
                        <Link href={`/editor/${article.url}`}>
                          Edit
                        </Link>
                        </ContextMenuItem>) : (  null )}
                      {session?.user?.name === user?.name || session?.user?.name === user?.username ? (
                        <ContextMenuItem onClick={() => handleDelete(article.postid)}>
                          Delete
                        </ContextMenuItem>) : (  null )}
                      <ContextMenuItem>Save</ContextMenuItem>
                      <ContextMenuItem>Share</ContextMenuItem>
                    </ContextMenuContent>
                    </div>
                  </ContextMenu>)
            ))
          ) : (
            <p className="text-base font-light text-center py-5">This user has no posts</p>
          )}
        </div>
          </div>
     )
}