"use client";
import EmptyFeed from '@/components/feed/feed';
import { getSessionUser } from '@/components/get-session-user';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef, Key } from 'react'
import FeedPostCard from '@/components/blog/feed-post-card'
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { set } from 'react-hook-form';
import { Icons } from '@/components/icon';

export default function Feed() {
  const { status, data: session } = useSession()
  const sessionUser = getSessionUser()
  const [feed, setFeed] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const sentinelRef = useRef(null)

  useEffect(() => {
async function fetchFeed() {
     if (status === 'unauthenticated') {
       return
     }
     const user = (await sessionUser).userid
     setLoading(true)
     try {
      const response = await fetch(`/api/feed?user=${user}&page=${page}`);
      if (!response.ok) {
        throw new Error(`Fetch failed with status: ${response.status}`);
      }

      const data = await response.json();

      setFeed([...feed, ...data.feed] as []);
      

      // This may not show the updated feed immediately due to React's batching
      console.log(feed);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching feed:', error);
      setLoading(false);
    }
  }   

    fetchFeed()
  }, [page])

  function handleLoadMore() {
    setPage(prevPage => prevPage + 1)
  }

  return (
    <>
    <main className="flex min-h-screen flex-col items-center justify-between feed ">
      <div className="feed__content">
         <div className="feed__content_title">My Feed</div>
         {
               feed.length > 0 ? ( null
               ) : (
               <div className="feed__content_subtitle">There either has been no new posts, or you don&apos;t follow anyone.</div>
               )
         }
         <div className="search feed__content_search max-w-[500px]">
           <div className="search-container">
             <div className="search__form">
             <div className="input">
               <div className="input__icon">
                 <Search className='search__form_icon' />
               </div>
               <Input placeholder="Search for people or tags" className="input__field !foucs-visible:ring-0 !focus-visible:ring-offset-0 !focus-visible:outline-none" />
             </div>
             </div>
           </div>
         </div>
         {
          feed.length === 0 && ( <EmptyFeed /> )
         }
         
          <div className="feed__list">
          <div className="feed__list_item">
          {feed.map((post: { postid: string; title: string; description: string; creationdate: string; author: { userid: string; username: any; }; coverimage: string | undefined; likes: string; comments: string; views: string; url: any; }) => (
        <FeedPostCard
                key={post.postid}
                id={post.postid as string}
                title={post.title}
                content={post.description}
                date={post.creationdate}
                author={post.author}
                thumbnail={post.coverimage}
                likes={post.likes}
                comments={post.comments}
                views={post.views} authorid={post.author.userid} session={session} url={`/${post.author?.username}/${post.url}`} />
      ))}


          </div>
          <div ref={sentinelRef} />
          {feed.length > 0 && (
            <div className="feed__list_loadmore">
              <Button onClick={handleLoadMore} variant={"secondary"} size={"lg"} disabled={loading}>Load more</Button>
            </div>
          )}
       </div>
        </div>
     </main>
      
    </>
  )
}