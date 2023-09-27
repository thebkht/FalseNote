"use client";
import { getSessionUser } from '@/components/get-session-user';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react'

export default function Feed() {
  const { status } = useSession()
  const sessionUser = getSessionUser()
  const [feed, setFeed] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(10)
  const sentinelRef = useRef(null)

  useEffect(() => {
async function fetchFeed() {
     if (status === 'unauthenticated') {
       return
     }
     setLoading(true)
     const user = (await sessionUser).userid
     const response = await fetch(`/api/feed?user=${user}&page=${page}`)
     const data = await response.json()
     setFeed(prevFeed => [...prevFeed, ...data.feed] as never[])
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

  const visibleFeed = feed.slice(startIndex, endIndex) as never[]

  return (
    <div>
      {visibleFeed.map(post => (
        <div key={post.postid}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Author: {post.author.name}</p>
        </div>
      ))}
      <div ref={sentinelRef} />
      {loading && <p>Loading...</p>}
    </div>
  )
}