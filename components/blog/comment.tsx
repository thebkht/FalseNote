"use client"
import Link from "next/link";
import UserHoverCard from "../user-hover-card";
import CommentForm from "./comments/comment-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { getSessionUser } from "../get-session-user";

const formatDate = (dateString: string | number | Date) => {
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

export default function PostComment({ comments, post, postAuthor }: { comments: any, post: any, postAuthor: any }) {
     const { status } = useSession();
     const [submitted, setSubmitted] = useState<boolean>(false);
     const commentsRef = useRef(comments)
     const [sessionUser, setSessionUser] = useState<any>(null)

     useEffect(() => {
          async function fetchData() {
               const sessionUser = await getSessionUser();
               setSessionUser(sessionUser)
          }
          fetchData()
     }, [])

     useEffect(() => {
          async function fetchData() {
               try {
                    const postData = await fetch(`/api/posts/${postAuthor.username}?url=${post.url}`, {
                         method: "GET",
                    }).then((res) => res.json());
                    commentsRef.current = postData.comments
               } catch (error) {
                    console.error(error)
               }
          }
          fetchData()
     }, [submitted])

     return (
          <>                     <div className="article__comments my-8 max-w-[80ch] lg:text-xl mx-auto">
                               <h1 className="article__comments-title text-2xl font-bold mb-4">Comments</h1>
                               {/* commentform prop that inticades comment posted or not */}
                               <CommentForm session={sessionUser} post={post?.postid}  submitted={submitted} />
                               <div className="article__comments-list">
                                    {
                                         commentsRef.current?.map((comment: any) => (
                                              <div className="article__comments-item flex gap-3 space-y-3" key={comment.id}>
                                                   <div className="article__comments-item-avatar mt-3">
                                                        <UserHoverCard user={comment.author} >
                                                             <Link href={`/${comment.author.username}`} className="inline-block">
                                                                  <Avatar className="h-10 w-10">
                                                                       <AvatarImage src={comment.author.profilepicture} alt={comment.author.name} />
                                                                       <AvatarFallback>{comment.author.name ? comment.author.name.charAt(0) : comment.author.username.charAt(0)}</AvatarFallback>
                                                                  </Avatar>
                                                             </Link>
                                                        </UserHoverCard>
                                                   </div>
                                                   <Card className="article__comments-item-card w-full bg-background">
                                                        <CardHeader className="w-full text-sm flex-row items-center p-4">
                                                        <Link href={`/${comment.author.username}`} className="inline-block">
                                                                  <span className="article__comments-item-author">{comment.author.name || comment.author.username}</span>
                                                             </Link>
                                                             <span className="mx-1.5 !mt-0"> · </span>
                                                             <span className="article__comments-item-date text-muted-foreground !mt-0">{formatDate(comment.creationdate)}</span>
                                                        </CardHeader>
                                                        <CardContent className="p-4 pt-0">
                                                       
                                                        <div className="article__comments-item-body text-sm">
                                                             <div dangerouslySetInnerHTML={{ __html: comment.content }} className="markdown-body" />
                                                        </div>
                                                        </CardContent>
                                                   </Card>
                                                  
                                              </div>
                                         ))
                                    }
                          </div>
                     </div>
               
          </>
     )
}