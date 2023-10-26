"use client";
import { getSessionUser } from '@/components/get-session-user';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef, Key, Suspense } from 'react'
import { Icons } from '@/components/icon';
import PopularPosts from '@/components/feed/popular-posts';
import { usePathname, useRouter } from 'next/navigation';
import FeaturedDev from '@/components/feed/featured/featured-dev';
import { Skeleton } from '@/components/ui/skeleton';
import FeedComponent from '@/components/feed/feed';
import UserExplore from '@/components/explore/user/details';
import ExploreTabs from '@/components/explore/navbar/navbar';

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

  const pathname = usePathname()

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
        <ExploreTabs />
            <div className="md:flex lg:flex-nowrap flex-wrap md:mx-[-16px] w-full gap-8 my-8">
              <UserExplore className='md:w-full lg:w-1/3 pt-4 lg:pt-0 h-fit md:my-4' />
              <Suspense fallback={<Skeleton className='w-full h-28' />}>
                <div className="md:my-4 md:w-[12.5%] lg:w-2/3">
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
                </div>
              </Suspense>
              {/* Popular posts, blogs, and tags  */}
              <div className="md:my-4 md:w-1/4 lg:w-1/3 space-y-6">
                <PopularPosts data={popularPosts} isloaded={!fetching} />
                <FeaturedDev data={topUsers} isloaded={!fetching} />
              </div>
              
            </div>
          </main>
    </>
  )
}