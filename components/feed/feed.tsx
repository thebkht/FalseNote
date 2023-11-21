"use client";
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from "../ui/skeleton";
import FeedPostCard from "../blog/feed-post-card";
import { fetchFeed } from './get-feed';
import { Card, CardContent, CardHeader } from '../ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-context-menu';
import { EmptyPlaceholder } from '../empty-placeholder';
import PostCardSkeleton from '../skeletons/feed-post-card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InfinitiveScrollFeed({ initialFeed, tag, session }: { initialFeed: any | undefined, tag: string | undefined, session: any }) {
  const [feed, setFeed] = useState<Array<any>>(initialFeed)
  const [page, setPage] = useState<number>(0)
  const [ref, inView] = useInView()
  const router = useRouter()
  //when tab change, feed is not updated yet so when when tab change it must be set feed to initialFeed
  useEffect(() => {
    setFeed(initialFeed)
  }, [initialFeed])

  async function loadMoreFeed() {
    const next = page + 1
    const result = await fetchFeed({ page: next, tab: tag, limit: 10 })
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

      <div className="flex flex-col lg:gap-6 md:gap-5 gap-4">
        {feed?.map((post: any) => (
          <React.Fragment key={post.id}>
          <FeedPostCard
            post={post}
            session={session}
          />
        </React.Fragment>
        ))}

        {
          feed.length >= 10 && (
            <div className="feed__list_loadmore !py-0 h-max" ref={ref}>
              <PostCardSkeleton className="rounded-lg bg-backgreound max-h-72 w-full border-none shadow-none" />
            </div>
          )
        }
      </div>
    </div>
  ) : 
    (
      tag == 'following' && (
        <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name='post' strokeWidth={1.5} />
      <EmptyPlaceholder.Title>No posts yet</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>When you follow someone, their posts will show up here.</EmptyPlaceholder.Description>
        <Button className="mt-4" onClick={
          () => {
            router.push('/feed')
          }
        }>Browse recommended posts</Button>
    </EmptyPlaceholder>
      )
    )
  
}
