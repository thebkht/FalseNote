"use client"
import { ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ContextMenu } from "../ui/context-menu";
import Link from "next/link";
import { useSession } from "next-auth/react";
import FeedPostCard from "../blog/feed-post-card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPosts({ posts: initialPosts, className, user, sessionUser }: { posts: any, className?: string, user?: any, sessionUser?: any }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts])
  async function handleDelete(postid: string) {
    await fetch(`/api/posts/${user?.username}?postid=${postid}`, {
      method: "DELETE",
    });
    await fetch(`/api/revalidate?path=/${user?.username}`)
    router.refresh();
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
                      </ContextMenuItem>) : (null)}
                    {sessionUser?.id === user?.id ? (
                      <ContextMenuItem onClick={() => handleDelete(article.id)}>
                        Delete
                      </ContextMenuItem>) : (null)}
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