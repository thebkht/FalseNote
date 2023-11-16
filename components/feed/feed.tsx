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
          <React.Fragment key={post.id}>
          <FeedPostCard
            post={post}
            session={session}
          />
          <Separator />
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
  ) : (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name='post' />
      <EmptyPlaceholder.Title>No posts yet</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>When you follow someone, their posts will show up here.</EmptyPlaceholder.Description>

    </EmptyPlaceholder>
  )
}