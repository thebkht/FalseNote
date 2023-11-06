"use client"
import { useSession } from "next-auth/react";
import PostCard from "../tags/post-card-v2";
import { Separator } from "../ui/separator";
import { EmptyPlaceholder } from "../empty-placeholder";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPosts({ posts: initialPosts, className, user, sessionUser, children, query, search }: { posts: any, className?: string, user?: any, sessionUser?: any, children?: React.ReactNode, query?: any, search: string | undefined }) {
  const router = useRouter();
  const [posts, setPosts] = useState<Array<any>>(initialPosts);

  const [page, setPage] = useState<number>(0)
  const [ref, inView] = useInView()
  //when tab change, feed is not updated yet so when when tab change it must be set feed to initialFeed
  useEffect(() => {
    setPosts(initialPosts)
  }, [initialPosts])

  async function loadMoreFeed() {
    const next = page + 1
    const result = await fetch(`api/user/${user.id}/posts?page=${next}${search ? `&search=${search}` : ''}`).then(res => res.json())
    const fetchedPosts = result?.posts
    if (fetchedPosts?.length) {
      setPage(next)
      setPosts(prev => [...prev, ...fetchedPosts])
    }
  }

  useEffect(() => {
    if (inView) {
      loadMoreFeed()
    }
  }, [inView])

  const { status } = useSession();
  if (status == "loading") return null;
  return (
    <div className={className}>
      <div className="user-articles lg:px-8 w-full">
        {children}
        <Separator className="md:hidden flex mt-4" />
        {posts?.length > 0 ? (
          <>
            {posts?.map((article: any) => (
              <>
                <PostCard post={article} session={sessionUser} user={true} />
                <Separator />
              </>
            ))}



            <div className="feed__list_loadmore !py-0 h-max" ref={ref}>
              <Card className="rounded-lg bg-backgreound max-h-72 w-full border-none shadow-none">
                <CardContent className="p-0">
                  <CardHeader className={cn("pt-4 pb-3 md:pt-6 px-0 gap-y-4")}>
                    <div className="flex items-center space-x-1">
                      <Skeleton className="w-32 h-3" />
                    </div>
                  </CardHeader>
                  <div className="flex justify-between">
                    <div className='w-full'>
                      <div>
                        <div className="pb-3 space-y-2">
                          <Skeleton className='w-full h-4' />
                          <Skeleton className='w-full h-4 md:hidden' />
                        </div>
                        <div className="space-y-2 hidden md:block">
                          <Skeleton className='w-full h-4' />
                          <Skeleton className='w-full h-4' />
                        </div>
                      </div>
                      <div className="py-8">
                        <div className="flex justify-between">
                          <Skeleton className='w-20 h-3' />
                        </div>
                      </div>
                    </div>
                    <Skeleton className="h-14 md:h-28 aspect-[8/5] ml-6 md:ml-8 rounded-none" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>

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
    </div >
  )
}