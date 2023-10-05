//Post view page for a specific user (username) and post (url)
// Path: app/%28Main%29/%5Busername%5D/%5Burl%5D/page.tsx
// Compare this snippet from components/feed/feed.tsx:
"use client"
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import React, { use, useEffect, useState } from "react"
import {
     HoverCard,
     HoverCardContent,
     HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CalendarDays, Check, User } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getSessionUser } from "@/components/get-session-user"
import { useSession } from "next-auth/react"
import { Icons } from "@/components/icon"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import PostCard from "@/components/blog/post-card"
import { formatNumberWithSuffix } from "@/components/format-numbers"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import CommentForm from "@/components/blog/comments/comment-form"
import LoginDialog from "@/components/login-dialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import UserHoverCard from "@/components/user-hover-card"

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


export default function PostView({ params }: { params: { username: string, url: string } }) {
     const [post, setPost] = useState<any>(null)
     const [isLoaded, setIsLoaded] = useState<boolean>(false)
     const [isFollowing, setIsFollowing] = useState<boolean | null>(null)
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false)
     const [sessionUser, setSessionUser] = useState<any>(null)
     const [comment, setComment] = useState<any>(null)
     const [submitted, setSubmitted] = useState<boolean>(false)
     const { status } = useSession()
     const router = useRouter()

     async function incrementPostViews() {
          const cookieName = `post_views_${params.username}_${params.url}`;
          const hasViewed = getCookie(cookieName);

          if (!hasViewed) {
          // Make an API request to increment the view count
          await fetch(`/api/posts/${params.username}/views/?url=${params.url}`, {
               method: "POST",
          });

          // Set a cookie to indicate that the post has been viewed
          const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
          document.cookie = `${cookieName}=true; expires=${expirationDate.toUTCString()}; path=/`;
          }
     }

     useEffect(() => {
          async function fetchData() {
               try {
                    const postData = await fetch(`/api/posts/${params.username}?url=${params.url}`, {
                         method: "GET",
                    })
                    const post = await postData.json()
                    if (status === "authenticated") {
                         const followerId = (await getSessionUser()).userid;
                         setSessionUser(await getSessionUser())
                         setIsFollowing(post?.author?.followers.find((follower: any) => follower.followerid === followerId));
                    }
                    setPost(post)
                    setIsLoaded(true)
               } catch (error) {
                    console.error(error)
                    setIsLoaded(true)
               }
          }
          fetchData()
     }, [params.url, params.username, isFollowing, status])

     useEffect(() => {
          if (post) {
               incrementPostViews()
          }
     }, [post])

     useEffect(() => {
          async function fetchData() {
               try {
                    const postData = await fetch(`/api/posts/${params.username}?url=${params.url}`, {
                         method: "GET",
                    })
                    const post = await postData.json()
                    setComment(post?.comments)
                    setIsLoaded(true)
               } catch (error) {
                    console.error(error)
                    setIsLoaded(true)
               }
          }
          fetchData()
     }, [submitted])

     async function handleFollow(followeeId: string) {
          if (status === "authenticated") {
               setIsFollowingLoading(true);
               try {
                    const followerId = (await getSessionUser()).userid;
                    await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
                         method: "GET",
                    });
               } catch (error) {
                    console.error(error);
               }
          } else {
               return null;
          }

     }

     if (!isLoaded) {
          return (
               <div className="w-full max-h-screen flex justify-center items-center bg-background" style={
                    {
                      minHeight: "calc(100vh - 192px)"
                    }
                  }>
                     <Icons.spinner className="h-10 animate-spin" />
                   </div>
          )
     }

     return (
          <>
               <div className="article">
                    <div className="xs:p-4 article__container">
                         <div className="article__header">
                         
                              <h1 className="article__title">{post?.title}</h1>
                              <div className="article__meta">
                                   <UserHoverCard user={post?.author} >
                                   <Button variant="link" className="px-0" asChild>
                                                  <Link href={`/${post?.author?.username}`}>
                                                       <Avatar className="article__author-avatar">
                                                            <AvatarImage src={post?.author?.profilepicture} alt={post?.author?.name} />
                                                            <AvatarFallback>{post?.author?.name ? post?.author?.name.charAt(0) : post?.author?.username.charAt(0)}</AvatarFallback>
                                                       </Avatar>
                                                  </Link>
                                             </Button>
                                   </UserHoverCard>

                                   <div className="flex flex-col">
                                        <span className="article__author-name md:text-base text-sm">
                                             <UserHoverCard user={post?.author} >
                                             <Link href={`/${post?.author?.username}`}>
                                             {post?.author?.name || post?.author?.username}
                                             {post?.author?.verified &&
                                                  (
                                                       <Badge className="h-4 w-4 ml-2 !px-0"> <Check className="h-3 w-3 mx-auto" /></Badge>
                                                  )}
                                             </Link>
                                             </UserHoverCard>

                                             {
                                                  status === "authenticated" ? sessionUser?.userid !== post?.author?.userid &&
                                                  (
                                                       <Button
                                                            variant="link"
                                                            className="py-0 h-6 px-1.5"
                                                            onClick={() => handleFollow(post?.authorId)}
                                                            disabled={isFollowingLoading}
                                                       >
                                                            {isFollowing ? "Following" : "Follow"}
                                                       </Button>
                                                  ) : (
                                                       <LoginDialog className="py-0 h-6 px-0">
                                                            <Button
                                                                 variant="link"
                                                                 className="py-0 h-6 px-3"
                                                                 onClick={() => handleFollow(post?.authorId)}
                                                                 disabled={isFollowingLoading}
                                                            >
                                                                 {isFollowing ? "Following" : "Follow"}
                                                            </Button>
                                                       </LoginDialog>
                                                  )
                                                  }
                                             


                                        </span>
                                        <span className="article__date">{post?.lastupdateddate == post?.creationdate ? formatDate(post?.creationdate) : (formatDate(post?.creationdate) + " · Updated on " + formatDate(post?.lastupdateddate))}</span>
                                   </div>
                              </div>
                         </div>

                         <Separator className="mt-8" />

                         <div className="article__content">
                              {
                                   post?.coverimage && (
                                        <div className="article__cover-image">
                                             <AspectRatio ratio={16 / 9} className="article__cover-image">
                                             <Image src={post?.coverimage} alt={post?.title} layout="fill" objectFit="cover" />
                                        </AspectRatio>
                                        </div>
                                   )
                              }
                              <div dangerouslySetInnerHTML={{ __html: post?.content }} className="markdown-body" />
                         </div>

                         <Separator className="my-8" />

                         {
                                   post?.tags && (
                                        <div className="article__tags">
                                             {post?.tags.map((tag: any) => (
                                                  <Link href={`/tag/${tag.tagname}`} key={tag.tagid}>
                                                       <Badge variant={"secondary"} className="h-6 w-auto !px-2 !py-0.5 mr-2 cursor-pointer font-normal">
                                                            #{tag.tagname}
                                                       </Badge>
                                                  </Link>
                                             ))}
                                        </div>
                                   )
                              }

                         <Separator className="my-8" />

                         {/* Comments */}
                         <div className="article__comments">
                              <h1 className="article__comments-title text-2xl font-bold mb-4">Comments</h1>
                              {/* commentform prop that inticades comment posted or not */}
                              <CommentForm session={sessionUser} post={post?.postid} status={status} submitted={submitted} />
                              <div className="article__comments-list">
                                   {
                                        post?.comments?.map((comment: any) => (
                                             <div className="article__comments-item flex gap-3 space-y-3" key={comment.commentid}>
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

                         
                         {/* <div>More From {post.author?.username}</div>
                         <div className="grid grid-cols-3 gap-4">
                              {
                                   post?.author?.posts?.map((post: any) => (
                                        post?.visibility === "public" && (
                                             <PostCard
                                             key={post.postid}
                                             title={post.title}
                                             thumbnail={post.coverimage}
                                             content={post.description}
                                             author={post.author?.username || post.author?.name}
                                             date={post.creationdate}
                                             views={formatNumberWithSuffix(post.views)}
                                             comments={formatNumberWithSuffix(post.commentsnum || 0)}
                                             id={post.id}
                                             authorid={post.author?.userid}
                                             session={sessionUser}
                                             likes={formatNumberWithSuffix(post.likes || 0)}
                                             url={`/${post.author?.username}/${post.url}`}
                                             posturl={post.url}
                                             className="mt-4" />
                                        )
                                   ))
                              }
                         </div> */}
                    </div>
               </div>
          </>
     )
}

function getCookie(name: string) {
     const cookies = document.cookie.split(";")
     for (const cookie of cookies) {
       const [cookieName, cookieValue] = cookie.split("=")
       if (cookieName.trim() === name) {
         return cookieValue
       }
     }
     return null
   }
