"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Check } from "lucide-react";
import LoginDialog from "../login-dialog";
import { Separator } from "../ui/separator";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { getSessionUser } from "../get-session-user";
import { useSession } from "next-auth/react";
import Markdown from "markdown-to-jsx";

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

export default function Post({ post, author, sessionUser, tags }: { post: any, author: any, sessionUser: any, tags: any }) {
     const [isFollowing, setIsFollowing] = useState<boolean>(false);
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
     const { status, data: session } = useSession();

     async function incrementPostViews() {
          const cookieName = `post_views_${author.username}_${post.url}`;
          const hasViewed = getCookie(cookieName);

          if (!hasViewed) {
          // Make an API request to increment the view count
          await fetch(`/api/posts/${author.username}/views/?url=${post.url}`, {
               method: "POST",
          });

          // Set a cookie to indicate that the post has been viewed
          const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
          document.cookie = `${cookieName}=true; expires=${expirationDate.toUTCString()}; path=/`;
          }
     }

     useEffect(() => {
          if(post){
               incrementPostViews();
          }
     }, [post]);

     async function handleFollow(followeeId: string) {
          if (status === "authenticated") {
               setIsFollowingLoading(true);
               try {
                    setIsFollowing(!isFollowing);
                    const followerId = (await getSessionUser()).userid;
                    const result = await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
                         method: "GET",
                    }).then((res) => res.json());
                    if (!result.ok) {
                         setIsFollowing(!isFollowing);
                    }

                    setIsFollowingLoading(false);
               } catch (error) {
                    console.error(error);
                    setIsFollowingLoading(false);
               }
          } else {
               return null;
          }
     }
     return (
          <>
               <div className="article">
                    <div className="article__container">
                         <div className="article__header max-w-[65ch] lg:text-xl mx-auto">
                         {
                                   post?.coverimage && (
                                        <Image src={post?.coverimage} alt={post?.title} fill className="rounded-lg !relative h-auto" />
                                   )
                              }
                              <h1 className="article__title">{post?.title}</h1>
                              <div className="article__meta">
                                   <UserHoverCard user={author} >
                                   <Button variant="link" className="px-0" asChild>
                                                  <Link href={`/${author?.username}`}>
                                                       <Avatar className="article__author-avatar">
                                                            <AvatarImage src={author?.profilepicture} alt={author?.username} />
                                                            <AvatarFallback>{author?.username.charAt(0)}</AvatarFallback>
                                                       </Avatar>
                                                  </Link>
                                             </Button>
                                   </UserHoverCard>

                                   <div className="flex flex-col">
                                        <span className="article__author-name md:text-base text-sm">
                                             <UserHoverCard user={author} >
                                             <Link href={`/${author?.username}`}>
                                             {author?.name || author?.username}
                                             {author?.verified &&
                                                  (
                                                       <Badge className="h-4 w-4 ml-2 !px-0"> <Check className="h-3 w-3 mx-auto" /></Badge>
                                                  )}
                                             </Link>
                                             </UserHoverCard>

                                             {
                                                  status === "authenticated" && session.user?.name !== author?.username || session?.user?.name !== author?.name ?
                                                  (
                                                       <Button
                                                            variant="link"
                                                            className="py-0 h-6 px-1.5"
                                                            onClick={() => handleFollow(post?.authorid)}
                                                            disabled={isFollowingLoading} >
                                                            {isFollowing ? "Following" : "Follow"}
                                                       </Button>
                                                  ) : (
                                                       <LoginDialog className="py-0 h-6 px-0">
                                                            <Button
                                                                 variant="link"
                                                                 className="py-0 h-6 px-3"
                                                                 onClick={() => handleFollow(post?.authorId)}
                                                                 disabled={isFollowingLoading} >
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

                         <article className="article__content markdown-body prose lg:prose-xl">
                              <Markdown>{post?.content}</Markdown>
                              {/* <div dangerouslySetInnerHTML={{ __html: post?.content }} className="markdown-body" /> */}
                         </article>

                         <Separator className="my-8" />

                         {
                                   tags && (
                                        <>
                                             <div className="article__tags space-x-2">
                                             {tags.map((tag: any) => (
                                                  <Link href={`/tag/${tag.tagname}`} key={tag.tagid}>
                                                       <Badge variant={"secondary"} className="h-6 w-auto cursor-pointer font-normal capitalize text-sm px-2 py-4">
                                                            {tag.tagname}
                                                       </Badge>
                                                  </Link>
                                             ))}
                                        </div>
                                        <Separator className="my-8" />
                                        </>
                                   )
                              }
                         
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
