"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Check } from "lucide-react";
import LoginDialog from "../login-dialog";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSessionUser } from "../get-session";
import { useSession } from "next-auth/react";
import Markdown from "markdown-to-jsx";
import TagBadge from "../tags/tag";
import PostTabs from "./navbar";

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
     const { status } = useSession();
     const [session, setSession] = useState<any>(sessionUser);

     useEffect(() => {
          setSession(sessionUser);
     }, [sessionUser])

     async function handleFollow(followeeId: string) {
          if (status === "authenticated") {
               setIsFollowingLoading(true);
               try {
                    setIsFollowing(!isFollowing);
                    const followerId = (await getSessionUser())?.id;
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
               <div className="article max-w-[680px] mx-auto">
                    <div className="article__container">
                         <div className="article__header lg:text-xl">
                              {
                                   post?.cover && (
                                        <Image src={post?.cover} alt={post?.title} fill className="!relative w-full" />
                                   )
                              }
                              <h1 className="article__title">{post?.title}</h1>
                              <div className="article__meta">
                                   <UserHoverCard user={author} >
                                        <Link href={`/${author?.username}`}>
                                             <Avatar className="article__author-avatar">
                                                  <AvatarImage src={author?.image} alt={author?.username} />
                                                  <AvatarFallback>{author?.username.charAt(0)}</AvatarFallback>
                                             </Avatar>
                                        </Link>
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
                                                  session?.id !== post?.authorId && (
                                                  status === "authenticated" ?
                                                       (
                                                            <Button
                                                                 variant="link"
                                                                 className="py-0 h-6 px-1.5"
                                                                 onClick={() => handleFollow(post?.authorId)}
                                                                 disabled={isFollowingLoading} >
                                                                 {isFollowing ? "Following" : "Follow"}
                                                            </Button>
                                                       ) : (
                                                            <LoginDialog className="py-0 h-6 px-0">
                                                                 <Button
                                                                      variant="link"
                                                                      className="py-0 h-6 px-3"
                                                                      disabled={isFollowingLoading} >
                                                                      {isFollowing ? "Following" : "Follow"}
                                                                 </Button>
                                                            </LoginDialog>
                                                       ))
                                             }




                                        </span>
                                        <span className="article__date">{!post?.updated ? formatDate(post?.createdAt) : (formatDate(post?.createdAt) + " · Updated on " + formatDate(post?.updatedAt))}</span>
                                   </div>
                              </div>
                              <PostTabs post={post} session={session} author={author} />
                         </div>


                         <article className="article__content markdown-body !max-w-full prose lg:prose-xl">
                              <Markdown>{post?.content}</Markdown>
                              {/* <div dangerouslySetInnerHTML={{ __html: post?.content }} className="markdown-body" /> */}
                         </article>


                         {
                              tags && (
                                   <>
                                        <div className="article__tags mx-auto">
                                             {tags.map((tag: any) => (
                                                  <Link href={`/tags/${tag.tag.name}`} key={tag.tag.id}>
                                                       <TagBadge className="my-1.5 mr-1.5" variant={"secondary"}>
                                                            {
                                                                 //replace - with space
                                                                 tag.tag.name.replace(/-/g, " ")
                                                            }
                                                       </TagBadge>
                                                  </Link>
                                             ))}
                                        </div>
                                   </>
                              )
                         }
                         <PostTabs post={post} session={session} author={author} className="border-none" />
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
