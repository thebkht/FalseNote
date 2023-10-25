"use client"
import { ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ContextMenu } from "../ui/context-menu";
import PostCard from "../blog/post-card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function UserPosts({ posts, className, user, sessionUser }: { posts: any, className?: string, user?: any, sessionUser?: any }) {
     const [deleted, setDeleted] = useState<boolean>(false);
     async function handleDelete(posturl: string) {
     await fetch(`/api/posts/${user?.username}?postid=${posturl}`, {
       method: "DELETE",
     });
     setDeleted(true);
   }

     const { data: session, status } = useSession();
     if (status !== "authenticated" || !session) return null;
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
                      
                    <PostCard
                title={article.title}
                thumbnail={article.cover}
                content={article.subtitle}
                author={user?.username || user?.name}
                date={article.createdAt}
                views={formatNumberWithSuffix(article.views)}
                comments={formatNumberWithSuffix(article.comments || 0)}
                id={article.id}
                authorid={user?.id}
                session={sessionUser}
                likes={formatNumberWithSuffix(article.likes || 0)}
                url={`/${user?.username}/${article.url}`}
                posturl={article.url}
                className="mt-4" />
                      </ContextMenuTrigger>
                    <ContextMenuContent className="w-full">
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