//Post view page for a specific user (username) and post (url)
// Path: app/%28Main%29/%5Busername%5D/%5Burl%5D/page.tsx
// Compare this snippet from components/feed/feed.tsx:
"use client"
import { useEffect, useState } from "react"


export default function PostView({ params }: { params: { username: string, url: string } }) {
     const [post, setPost] = useState<any>(null)
     const [isLoaded, setIsLoaded] = useState<boolean>(false)
     
     useEffect(() => {
          async function fetchData() {
               try {
                    const postData = await fetch(`/api/posts/${params.username}?url=${params.url}`, {
                         method: "GET",
                    })
                    const post = await postData.json()
                    setPost(post)
                    setIsLoaded(true)
               } catch (error) {
                    console.error(error)
                    setIsLoaded(true)
               }
          }
          fetchData()
     }, [params.url, params.username])

     return (
          <>
          <div className="article">
               <div className="article__container">
                    <div className="article__header">
                         <h1 className="article__title ">{post?.title}</h1>
                         <div className="article__meta">
                              <span className="article__author">{post?.author.name}</span>
                              <span className="article__date">{post?.date}</span>
                         </div>
                    </div>
               </div>
          </div>
          </>
     )
}