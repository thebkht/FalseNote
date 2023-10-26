"use client";
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from "../ui/skeleton";
import FeedPostCard from "../blog/feed-post-card";
import { fetchFeed } from './get-feed';
import { Icons } from '../icon';
import { getSessionUser } from '../get-session-user';

export default function InfinitiveScrollFeed({ initialFeed }: { initialFeed: any }) {
  const [feed, setFeed] = useState<Array<any>>(initialFeed)
  const [page, setPage] = useState<number>(0)
  const [ref, inView] = useInView()

  async function loadMoreFeed() {
    console.log("Loading more feed")
    const next = page + 1
    console.log("Next page", next)
    const fetchedFeed = await fetch(`/api/feed?page=${next}&user=${(await getSessionUser()).id}`).then(res => res.json())
    if (fetchedFeed?.feed.length) {
      setPage(next)
      setFeed(prev => [...(prev?.length ? prev : []), ...fetchedFeed.feed])
    }
  }

  useEffect(() => {
    if (inView) {
      loadMoreFeed()
    }
  }, [inView])

  return (
    <div className="feed__list">
      {/* {
        isLoaded && feed.length === 0 && (
          <div className="w-full max-h-screen my-auto flex justify-center items-center bg-background">
            <div className="flex flex-col items-center justify-center space-y-4">
              <h1 className="text-2xl font-bold">No posts yet</h1>
              <p className="text-muted-foreground">When you follow someone, their posts will show up here.</p>
            </div>
          </div>
        )
      } */}

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
            likes={post._count.likes || "0"}
            comments={post._count.comments || "0"}
            views={post.views}
            authorid={post.author?.userid}
            url={`/${post.author?.username}/${post.url}`}
          />
        ))}

        <div className="feed__list_loadmore my-8 h-max" ref={ref}>
          <Icons.spinner className="h-10 animate-spin mr-2" /> Loading...
        </div>
      </div>
    </div>
  )
}