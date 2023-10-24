"use client";
import EmptyFeed from '@/components/feed/feed';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef, Key } from 'react'
import FeedPostCard from '@/components/blog/feed-post-card'
import { Icons } from '@/components/icon';
import PopularPosts from '@/components/feed/popular-posts';
import { useRouter } from 'next/navigation';

export default function Feed() {
  const { status, data: session } = useSession()
  const [feed, setFeed] = useState<any | null>([])
  const [page, setPage] = useState(0)
  const [fetching, setFetching] = useState<boolean>(true)
  const [loading, setLoading] = useState(true)
  const [feedLength, setFeedLength] = useState<number>(0)
  const [popularPosts, setPopularPosts] = useState<any | null>([])
  const sentinelRef = useRef(null)
  const route = useRouter()

  useEffect(() => {
async function fetchFeed() {
  if (status !== "unauthenticated") {
     try {
      const response = await fetch(`/api/feed?user=${session?.user?.id}&page=${page}`);
      if (!response.ok) {
        throw new Error(`Fetch failed with status: ${response.status}`);
      }
      const data = await response.json();

      setFeed((prevFeed: any) => [...prevFeed, ...data.feed]);
      setPopularPosts(data.popular);
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

  return (
    <>
    <main className="flex flex-col items-center justify-between feed ">
      <div className="feed__content">         
          <div className="feed__list">
         {
            fetching && ( <div className="w-full max-h-screen my-auto flex justify-center items-center bg-background">
               <Icons.spinner className="h-10 animate-spin mr-2" /> Loading...
             </div> )
         }

         {
          !fetching && feed.length === 0 && (
            <div className="w-full max-h-screen my-auto flex justify-center items-center bg-background">
              <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">No posts yet</h1>
                <p className="text-muted-foreground">When you follow someone, their posts will show up here.</p>
              </div>
            </div>
          )
         }
         
          <div className="feed__list_item">
          {feed.map((post: any) => (
        <FeedPostCard
                key={post.id}
                id={post.id as string}
                title={post.title}
                content={post.subtitle}
                date={post.createdAt}
                author={post.author}
                thumbnail={post.cover}
                likes={post.likes}
                comments={post.comments || "0"}
                views={post.views} authorid={post.author?.userid} session={session} url={`/${post.author?.username}/${post.url}`} />
      ))}


          </div>

          <div ref={sentinelRef} />
          {feed.length !== 0 && (
            <div className="feed__list_loadmore my-8">
              <div ref={sentinelRef} />
              <Icons.spinner className="h-10 animate-spin mr-2" /> Loading...
            </div>
          )}
          </div>
          {/* Popular posts, blogs, and tags */}
          <div className="feed__popular">
         {
          popularPosts.length !== 0 && (
            <PopularPosts data={popularPosts} isloaded={!fetching} />
          )
         }
         <EmptyFeed />
          </div>
        </div>
     </main>
      
    </>
  )
}