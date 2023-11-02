"use client";
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from "../ui/skeleton";
import FeedPostCard from "../blog/feed-post-card";
import { Card, CardContent, CardHeader } from '../ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-context-menu';
import { Button } from '../ui/button';

export default function Posts({ initialPosts, search, session }: { initialPosts: any | undefined, search: string | undefined, session: any }) {
     const [posts, setposts] = useState<Array<any>>(initialPosts)
     const [page, setPage] = useState<number>(0)
     const [isLoading, setIsLoading] = useState<boolean>(false)
     const [isLast, setIsLast] = useState<boolean>(false)
     useEffect(() => {
          setposts(initialPosts)
          setIsLast(false)
     }, [initialPosts])

     async function loadMorePosts() {
          const next = page + 1
          setIsLoading(true)
          const result = await fetch(`/api/posts?page=${next}${search ? `&search=${search}` : ''}`).then(res => res.json())
          setIsLoading(false)
          const fetchedposts = result?.posts
          if (fetchedposts?.length) {
               setPage(next)
               setposts(prev => [...prev, ...fetchedposts])
          } else {
               setIsLast(true)
          }
     }

     return (
          <div className="feed__list">
               {/* {
        isLoaded && posts.length === 0 && (
          <div className="w-full max-h-screen my-auto flex justify-center items-center bg-background">
            <div className="flex flex-col items-center justify-center space-y-4">
              <h1 className="text-2xl font-bold">No posts yet</h1>
              <p className="text-muted-foreground">When you follow someone, their posts will show up here.</p>
            </div>
          </div>
        )
      } */}

               <div className="divide-y">
                    {posts?.map((post: any) => (
                         <>
                              <FeedPostCard
                                   key={post.id}
                                   post={post}
                                   session={session}
                              />
                              <Separator />
                         </>
                    ))}

                    <div className="feed__list_loadmore h-max py-6">
                         <Button className="w-full" variant="outline" onClick={loadMorePosts} disabled={isLast}>{
                              isLoading ? "Loading..." : "Load more"
                         }</Button>
                    </div>
               </div>
          </div>
     )
}