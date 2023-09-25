//Post view page for a specific user (username) and post (url)
// Path: app/%28Main%29/%5Busername%5D/%5Burl%5D/page.tsx
// Compare this snippet from components/feed/feed.tsx:
"use client"

import { type } from "os"
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
          <h1>{post?.title}</h1>
          <h3>{post?.content}</h3>
          </>
     )
}