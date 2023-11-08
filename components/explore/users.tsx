"use client";
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from "../ui/skeleton";
import FeedPostCard from "../blog/feed-post-card";
import { Card, CardContent, CardHeader } from '../ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-context-menu';
import { Button } from '../ui/button';
import { EmptyPlaceholder } from '../empty-placeholder';
import UserHorizontalCard from '../user-horizontal-card';

export default function Users({ users: initialUser, search, session }: { users: any | undefined, search?: string | undefined, session: any }) {
     const [users, setUsers] = useState<Array<any>>(initialUser)
     const [page, setPage] = useState<number>(0)
     const [isLoading, setIsLoading] = useState<boolean>(false)
     const [isLast, setIsLast] = useState<boolean>(false)
     useEffect(() => {
          setUsers(initialUser)
          setIsLast(false)
     }, [initialUser])

     async function loadMorePosts() {
          const next = page + 1
          setIsLoading(true)
          const result = await fetch(`/api/posts?page=${next}${search ? `&search=${search}` : ''}`).then(res => res.json())
          setIsLoading(false)
          const fetchedposts = result?.posts
          if (fetchedposts?.length) {
               setPage(next)
               setUsers(prev => [...prev, ...fetchedposts])
          } else {
               setIsLast(true)
          }
     }

     return users.length > 0 ? (
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
                    {users?.map((user: any) => (
                         <>
                              <UserHorizontalCard user={user} className="w-full" />
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
     ) : (
          <div className="flex flex-col items-center justify-center w-full">
                              <EmptyPlaceholder>
                              <EmptyPlaceholder.Icon name="post" strokeWidth={1.25} />
                              <EmptyPlaceholder.Title>No posts found</EmptyPlaceholder.Title>
                              <EmptyPlaceholder.Description>
                                   Try searching for something else.
                              </EmptyPlaceholder.Description>
                         </EmptyPlaceholder>
                         </div>
     )
}