//Post view page for a specific user (username) and post (url)
// Path: app/%28Main%29/%5Busername%5D/%5Burl%5D/page.tsx
// Compare this snippet from components/feed/feed.tsx:
"use client"
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

//format date ex: if published this year Apr 4, otherwise Apr 4, 2021
const formatDate = (dateString: string | number | Date) => {
     //format date ex: if published this year Apr 4, otherwise Apr 4, 2021
     const date = new Date(dateString)
     const currentYear = new Date().getFullYear()
     const year = date.getFullYear()
     const formattedDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour12: true,
     })
     if (year !== currentYear) {
          return date.toLocaleDateString("en-US", {
               year: "numeric",
               month: "short",
               day: "numeric",
               hour12: true,
          })
     }
     return formattedDate
}


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
                         <h1 className="article__title">{post?.title}</h1>
                         <div className="article__meta">
                         <Avatar className="article__author-avatar">
                                        <AvatarImage src={post?.author?.profilepicture} alt={post?.author?.name} />
                                        <AvatarFallback>{post?.author?.name ? post?.author?.name.charAt(0) : post?.author?.username.charAt(0)}</AvatarFallback>
                                   </Avatar>
                                   
                                   <div className="flex flex-col">
                                   <span className="article__author-name">{post?.author?.name || post?.author?.username} <Button variant={"link"} size={"default"} className="py-0 h-6 px-3" >Follow</Button></span>
                                   <span className="article__date">{ formatDate(post?.creationdate) }</span>
                                   </div>
                         </div>
                    </div>

                    <div className="article__content">
                         <div dangerouslySetInnerHTML={{ __html: post?.content }}  className="markdown-body"/>
                    </div>
               </div>
          </div>
          </>
     )
}