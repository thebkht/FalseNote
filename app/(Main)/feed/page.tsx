"use client";
import EmptyFeed from '@/components/feed/feed';
import { getSessionUser } from '@/components/get-session-user';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react'
import FeedPostCard from '@/components/blog/feed-post-card'

export default function Feed() {
  const { status, data: session } = useSession()
  const sessionUser = getSessionUser()
  const [feed, setFeed] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(10)
  const sentinelRef = useRef(null)

  useEffect(() => {
async function fetchFeed() {
     if (status === 'unauthenticated') {
       return
     }
     const user = (await sessionUser).userid
     const response = await fetch(`/api/feed?user=${user}&page=${page}`)
     const data = await response.json()
     if (page === 0) {
          setFeed(data.feed as never[])
      } else {
          setFeed(prevFeed => [...prevFeed, ...data.feed] as never[])
     }
     setLoading(false)
}

    fetchFeed()
  }, [page, sessionUser, status])

  useEffect(() => {
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
  }, [loading])

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const scrollHeight = document.body.scrollHeight

      const visibleStartIndex = Math.floor(scrollTop / 100)
      const visibleEndIndex = Math.min(
        feed.length,
        visibleStartIndex + Math.ceil(windowHeight / 100)
      )

      setStartIndex(visibleStartIndex)
      setEndIndex(visibleEndIndex)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [feed])

  const visibleFeed = feed.slice(startIndex, endIndex) as any[]

  if (status === 'unauthenticated') {
    return <EmptyFeed />
  }

  if (feed.length === 0) {
     return <EmptyFeed />
  }

  return (
    <>
      {visibleFeed.map(post => (
        <FeedPostCard
                key={post.postid}
                id={post.postid}
                title={post.title}
                content={post.description}
                date={post.creationdate}
                author={post.author}
                thumbnail={post.coverimage}
                likes={post.likes}
                comments={post.comments}
                views={post.views} authorid={post.author.userid} session={session} url={`/${post.author?.username}/${post.url}`} />
      ))}
      <div ref={sentinelRef} />
      {loading && <p>Loading...</p>}
    </>
  )
}