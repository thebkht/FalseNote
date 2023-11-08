"use client";
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from "../ui/skeleton";
import FeedPostCard from "../blog/feed-post-card";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-context-menu';
import { Button } from '../ui/button';
import { EmptyPlaceholder } from '../empty-placeholder';

export default function Posts({ initialPosts, search, session }: { initialPosts: any | undefined, search?: string | undefined, session: any }) {
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

     return posts.length > 0 ? (
          <div className="feed__list md:w-[600px]">
               <Card>
                    <CardHeader className="pb-0">
                         <CardTitle className="feed__content_featured_card_title text-base">Posts</CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                         {posts?.map((post: any) => (
                              <>
                                   <FeedPostCard
                                        key={post.id}
                                        post={post}
                                        session={session}
                                        className='bg-transparent border-none shadow-none'
                                   />
                                   <Separator />
                              </>
                         ))}
                    </CardContent>
                    <CardFooter>
                         <div className="w-full">
                              <Button className="w-full" variant="outline" onClick={loadMorePosts} disabled={isLast}>{
                                   isLoading ? "Loading..." : "Load more"
                              }</Button>
                         </div>
                    </CardFooter>
               </Card>

          </div>
     ) : (
          <div className="flex flex-col items-center justify-center w-full">
               <EmptyPlaceholder className='w-full'>
                    <EmptyPlaceholder.Icon name="post" strokeWidth={1.25} />
                    <EmptyPlaceholder.Title>No posts found</EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                         Try searching for something else.
                    </EmptyPlaceholder.Description>
               </EmptyPlaceholder>
          </div>
     )
}