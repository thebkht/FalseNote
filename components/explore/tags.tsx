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
import UserHorizontalCard from '../user-horizontal-card';
import UserHoverCard from '../user-hover-card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Icons } from '../icon';
import { Hash } from 'lucide-react';

export default function Tags({ tags: initialTags, search, session }: { tags: any | undefined, search?: string | undefined, session: any }) {
     const [tags, setTags] = useState<Array<any>>(initialTags)
     const [page, setPage] = useState<number>(0)
     const [isLoading, setIsLoading] = useState<boolean>(false)
     const [isLast, setIsLast] = useState<boolean>(false)
     useEffect(() => {
          setTags(initialTags)
          setIsLast(false)
     }, [initialTags])

     async function loadMorePosts() {
          const next = page + 1
          setIsLoading(true)
          const result = await fetch(`/api/tags/search?page=${next}${search ? `&search=${search}` : ''}`).then(res => res.json())
          setIsLoading(false)
          const fetchedTags = result?.tags
          if (fetchedTags?.length) {
               setPage(next)
               setTags(prev => [...prev, ...fetchedTags])
          } else {
               setIsLast(true)
          }
     }

     return tags.length > 0 ? (
          <div className="feed__list md:w-[600px] w-full">
               <Card>
                    <CardHeader className="">
                         <CardTitle className="feed__content_featured_card_title text-base">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="flex flex-col divide-y">
                                   {tags?.map((tag: any, index: number) => (
                                        <div className="flex items-center justify-between py-4" key={tag.id}>
                                             <Link href={`/tags/${tag.name}`} className="w-full">
                                                  <div className="flex items-center">
                                                       <div className="space-y-1">
                                                            <p className="text-base capitalize"><Hash className="h-4 w-4 mr-1.5 inline" />{tag.name.replace(/-/g, " ")}</p>
                                                            <p className="text-sm text-muted-foreground">{tag._count.posts} posts · {tag._count.followingtag} followers</p>
                                                       </div>
                                                  </div>
                                             </Link>
                                        </div>
                                   ))}
                              </div>
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
                    <EmptyPlaceholder.Icon name="hash" strokeWidth={1.25} />
                    <EmptyPlaceholder.Title>No tags found</EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                         Try searching for something else.
                    </EmptyPlaceholder.Description>
               </EmptyPlaceholder>
          </div>
     )
}