"use client";
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from "../ui/skeleton";
import FeedPostCard from "../blog/feed-post-card";
import { fetchFeed } from './get-feed';
import { Card, CardContent, CardHeader } from '../ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-context-menu';
import { EmptyPlaceholder } from '../empty-placeholder';

export default function InfinitiveScrollFeed({ initialFeed, tag, session }: { initialFeed: any | undefined, tag: string | undefined, session: any }) {
  const [feed, setFeed] = useState<Array<any>>(initialFeed)
  const [page, setPage] = useState<number>(0)
  const [ref, inView] = useInView()
  //when tab change, feed is not updated yet so when when tab change it must be set feed to initialFeed
  useEffect(() => {
    setFeed(initialFeed)
  }, [initialFeed])

  async function loadMoreFeed() {
    const next = page + 1
    const result = await fetch(`api/feed?page=${next}${tag ? `&tag=${tag}` : ''}`).then(res => res.json())
    const fetchedFeed = result?.feed
    if (fetchedFeed?.length) {
      setPage(next)
      setFeed(prev => [...prev, ...fetchedFeed])
    }
  }

  useEffect(() => {
    if (inView) {
      loadMoreFeed()
    }
  }, [inView])

  return feed.length > 0 ? (
    <div className="feed__list">

      <div className="divide-y">
        {feed?.map((post: any) => (
          <>
            <FeedPostCard
              key={post.id}
              post={post}
              session={session}
            />
            <Separator />
          </>
        ))}

        {
          feed.length >= 10 && (
            <div className="feed__list_loadmore !py-0 h-max" ref={ref}>
              <Card className="rounded-lg bg-backgreound max-h-72 w-full border-none shadow-none">
                <CardContent className="py-0 px-0 md:px-4">
                  <CardHeader className={cn("pt-4 pb-3 md:pt-6 px-0 gap-y-4")}>
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-6 w-6 mr-1 md:mr-1.5" />
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
                    <Skeleton className="h-14 md:h-28 aspect-[4/3] md:aspect-square ml-6 md:ml-8 rounded-none" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        }
      </div>
    </div>
  ) : (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name='post' />
      <EmptyPlaceholder.Title>No posts yet</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>When you follow someone, their posts will show up here.</EmptyPlaceholder.Description>

    </EmptyPlaceholder>
  )
}