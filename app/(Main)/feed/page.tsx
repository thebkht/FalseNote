"use client";
import { getSessionUser } from '@/components/get-session-user';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef, Key, Suspense } from 'react'
import { Icons } from '@/components/icon';
import PopularPosts from '@/components/feed/popular-posts';
import { useRouter } from 'next/navigation';
import FeaturedDev from '@/components/feed/featured/featured-dev';
import { Skeleton } from '@/components/ui/skeleton';
import FeedComponent from '@/components/feed/feed';

export default function Feed() {
  const { status, data: session } = useSession()
  const sessionUser = getSessionUser()
  const [feed, setFeed] = useState<any | null>([])
  const [page, setPage] = useState(0)
  const [fetching, setFetching] = useState<boolean>(true)
  const [loading, setLoading] = useState(true)
  const [feedLength, setFeedLength] = useState<number>(0)
  const [popularPosts, setPopularPosts] = useState<any | null>([])
  const [topUsers, setTopUsers] = useState<any | null>([])
  const sentinelRef = useRef(null)
  const route = useRouter()

  useEffect(() => {
    async function fetchFeed() {
      if (status !== "unauthenticated") {
        const user = (await sessionUser)?.id
        try {
          const response = await fetch(`/api/feed?user=${user}&page=${page}`);
          if (!response.ok) {
            throw new Error(`Fetch failed with status: ${response.status}`);
          }
          const topUsers = await fetch(`/api/users/top?user=${user}`, {
            method: "GET",
          }).then((res) => res.json());
          const data = await response.json();

          setFeed((prevFeed: any) => [...prevFeed, ...data.feed]);
          setPopularPosts(data.popular);
          setTopUsers(topUsers.topUsers);
          setFeedLength(data.feedLength);
          setFetching(false);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching feed:', error);
          setLoading(false);
          setFetching(false);
        }
      } else {
        setFetching(false)
        route.push('/')
      }
    }

    fetchFeed()
  }, [page])

  useEffect(() => {
    if (feedLength !== 0 && feed.length !== feedLength) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && !loading) {
            setPage(prevPage => prevPage + 1)
          }
        },
        { rootMargin: '0px 0px 100% 0px' }
      )

      if (sentinelRef.current) {
        observer.observe(sentinelRef.current)
      }

      return () => {
        if (sentinelRef.current) {
          observer.unobserve(sentinelRef.current)
        }
      }
    }
  }, [loading])

  if (status !== "authenticated") {
    return null
  }

  return (
    <>
      <main className="flex flex-col items-center justify-between feed ">
            <div className="feed__content feed__content-md">
              
              <Suspense fallback={<Skeleton className='w-full h-28' />}>
                {
                fetching && (
                  <div className="feed__list_loadmore my-8 h-max">
                    <Icons.spinner className="h-10 animate-spin mr-2" /> Loading...
                  </div>
                )
              }
               <FeedComponent feed={feed} isLoaded={!fetching}>
                <div ref={sentinelRef} />
               </FeedComponent>
              </Suspense>
              {/* Popular posts, blogs, and tags  */}
              <div className="feed__popular space-y-6">
                <PopularPosts data={popularPosts} isloaded={!fetching} />
                <FeaturedDev data={topUsers} isloaded={!fetching} />
              </div>
              
            </div>
          </main>
    </>
  )
}