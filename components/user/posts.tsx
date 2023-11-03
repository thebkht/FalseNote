"use client"
import { ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ContextMenu } from "../ui/context-menu";
import Link from "next/link";
import { useSession } from "next-auth/react";
import FeedPostCard from "../blog/feed-post-card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostCard from "../tags/post-card-v2";
import { Separator } from "../ui/separator";
import { EmptyPlaceholder } from "../empty-placeholder";

export default function UserPosts({ posts: initialPosts, className, user, sessionUser, children }: { posts: any, className?: string, user?: any, sessionUser?: any, children?: React.ReactNode }) {
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
  if (status == "loading") return null;
  return (
    <div className={className}>
      <div className="user-articles lg:px-8 w-full">
        {children}
      <Separator className="md:hidden flex mt-4" />
        {posts?.length > 0 ? (
          posts?.map((article: any) => (
            <ContextMenu key={article.id}>
                <div className="">
                  <ContextMenuTrigger className="">
                    <PostCard post={article} session={sessionUser} user={true} />
                    <Separator />
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
          ))
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" strokeWidth={1.25} />
            <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              {user?.id === sessionUser?.id ? (
                <>You don&apos;t have any posts yet. Start creating content.</>)
              : (
                <>The user doesn&apos;t have any posts yet.</>)
              }
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </div>
    </div>
  )
}