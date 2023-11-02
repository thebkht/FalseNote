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
import { dateFormat } from "@/lib/format-date";
import { useRouter } from "next/navigation";

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

export default function Post({ post: initialPost, author, sessionUser, tags }: { post: any, author: any, sessionUser: any, tags: any }) {
     const [isFollowing, setIsFollowing] = useState<boolean>(author.Followers?.some((follower: any) => follower.followerId === sessionUser?.id));
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
     const { status } = useSession();
     const [session, setSession] = useState<any>(sessionUser);
     const [post, setPost] = useState<any>(initialPost);

     useEffect(() => {
          setPost(initialPost);
     }, [initialPost])

     useEffect(() => {
          setSession(sessionUser);
     }, [sessionUser])

     const router = useRouter();

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
                    await fetch(`/api/revalidate?page=/${author?.username}/${post?.url}`, {
                         method: "GET",
                         }).then((res) => res.json());
                    router.refresh();
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
               <div className="article max-w-[650px] lg:max-w-[680px] mx-auto">
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
                                        <div className="article__date">
                                             <span className="">{post?.readingTime}</span>
                                             <span className=" mx-1">·</span>
                                             <span className="">{dateFormat(post?.createdAt)}</span>
                                             {
                                                  post?.updated && (
                                                       <>
                                                            <span className=" mx-1">·</span>
                                                            <span className="">Updated on {dateFormat(post?.updatedAt)}</span>
                                                       </>
                                                  )
                                             }
                                        </div>
                                   </div>
                              </div>
                         </div>

                         <PostTabs post={post} session={session} author={author} className="mt-8" />
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

                         <div className="sticky top-0 w-full left-0 mt-8">
                              <PostTabs post={post} session={session} author={author} className="border-none" />
                         </div>
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
