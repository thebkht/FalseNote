//Post view page for a specific user (username) and post (url)
// Path: app/%28Main%29/%5Busername%5D/%5Burl%5D/page.tsx
// Compare this snippet from components/feed/feed.tsx:
"use client"
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {
     HoverCard,
     HoverCardContent,
     HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CalendarDays, Check } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getSessionUser } from "@/components/get-session-user"
import { useSession } from "next-auth/react"

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
     const [isFollowing, setIsFollowing] = useState<boolean | null>(null)
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false)
     const [sessionUser, setSessionUser] = useState<any>(null)
     const { status } = useSession()

     useEffect(() => {
          async function fetchData() {
               try {
                    const postData = await fetch(`/api/posts/${params.username}?url=${params.url}`, {
                         method: "GET",
                    })
                    const post = await postData.json()
                    if (status === "authenticated") {
                         const followerId = (await getSessionUser()).userid;
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

     async function handleFollow(followeeId: string) {
          if (status === "authenticated") {
               setIsFollowingLoading(true);
               try {
                    const followerId = (await getSessionUser()).userid;
                    await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
                         method: "GET",
                    });
                    setIsFollowing(!isFollowing);
               } catch (error) {
                    console.error(error);
               }
          } else {
               return null;
          }
     }


     return (
          <>
               <div className="article">
                    <div className="article__container">
                         <div className="article__header">
                              <h1 className="article__title">{post?.title}</h1>
                              <div className="article__meta">
                                   <HoverCard>
                                        <HoverCardTrigger asChild>
                                             <Button variant="link" className="px-0" asChild>
                                                  <Link href={`/${post?.author?.username}`}>
                                                       <Avatar className="article__author-avatar">
                                                            <AvatarImage src={post?.author?.profilepicture} alt={post?.author?.name} />
                                                            <AvatarFallback>{post?.author?.name ? post?.author?.name.charAt(0) : post?.author?.username.charAt(0)}</AvatarFallback>
                                                       </Avatar>
                                                  </Link>
                                             </Button>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="">
                                             <div className="flex space-x-4">
                                                  <Avatar className="h-14 w-14">
                                                       <AvatarImage src={post?.author?.profilepicture} alt={post?.author?.name} />
                                                       <AvatarFallback>{post?.author?.name ? post?.author?.name.charAt(0) : post?.author?.username.charAt(0)}</AvatarFallback>
                                                  </Avatar>
                                                  <div className="space-y-1">
                                                       <h4 className="text-sm font-semibold">{post?.author?.name || post?.author?.username} {post?.author?.verified && (<Badge className="h-3 w-3 !px-0"> <Check className="h-2 w-2 mx-auto" /></Badge>)}</h4>
                                                       <p className="text-sm">
                                                            {post?.author?.bio}
                                                       </p>
                                                       <div className="flex items-center pt-2">
                                                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                                            <span className="text-xs text-muted-foreground">
                                                                 Joined {formatDate(post?.author?.registrationdate)}
                                                            </span>
                                                       </div>
                                                  </div>
                                             </div>
                                        </HoverCardContent>
                                   </HoverCard>

                                   <div className="flex flex-col">
                                        <span className="article__author-name">{post?.author?.name || post?.author?.username}
                                             {post?.author?.verified &&
                                                  (
                                                       <Badge className="h-4 w-4 ml-2 !px-0"> <Check className="h-3 w-3 mx-auto" /></Badge>
                                                  )}

                                             <Button
                                                  variant={"link"}
                                                  size={"default"}
                                                  className="py-0 h-6 px-3"
                                                  onClick={(e) => handleFollow(post?.authorId)}
                                             >
                                                  {isFollowing ? (<>Followind</>) : <>Follow</>}
                                             </Button>


                                        </span>
                                        <span className="article__date">{post?.creationdate && formatDate(post?.creationdate)}</span>
                                   </div>
                              </div>
                         </div>

                         <div className="article__content">
                              <div dangerouslySetInnerHTML={{ __html: post?.content }} className="markdown-body" />
                         </div>
                    </div>
               </div>
          </>
     )
}