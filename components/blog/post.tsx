"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MoreHorizontal } from "lucide-react";
import LoginDialog from "../login-dialog";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSessionUser } from "../get-session";
import { useSession } from "next-auth/react";
import TagBadge from "../tags/tag";
import PostTabs from "./navbar";
import { dateFormat } from "@/lib/format-date";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "../icon";
import CommentsSheet from "./comments/comments-sheet";
import MobilePostTabs from "./mobile-navbar";
import PostMoreActions from "./post-more-actions";
import PublishDialog from "./publish-dialog";
import MarkdownCard from "../markdown-card";
import { validate } from "@/lib/revalidate";
import { Separator } from "../ui/separator";

export default function SinglePost({ post: initialPost, author, sessionUser, tags, comments, published }: { post: any, author: any, sessionUser: any, tags: any, comments: boolean | undefined, published: boolean | undefined }) {

     const [isFollowing, setIsFollowing] = useState<boolean>(author.Followers?.some((follower: any) => follower.followerId === sessionUser?.id));
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
     const { status } = useSession();
     const [session, setSession] = useState<any>(sessionUser);
     const [post, setPost] = useState<any>(initialPost);
     const [openComments, setOpenComments] = useState<boolean>(comments || false);
     const [openPublishDialog, setOpenPublishDialog] = useState<boolean>(published || false);

     useEffect(() => {
          setPost(initialPost);
     }, [initialPost])

     useEffect(() => {
          setSession(sessionUser);
     }, [sessionUser])

     useEffect(() => {
          setIsFollowing(author.Followers?.some((follower: any) => follower.followerId === sessionUser?.id));
     }, [author])

     const router = useRouter();
     const pathaname = usePathname();

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
                    await validate(pathaname)
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
     if(openPublishDialog === false && published === true){
          router.replace(`/@${author?.username}/${post?.url}`)
     }
     return (
          <>
               <PublishDialog post={post} user={post.author} open={openPublishDialog} onOpenChange={setOpenPublishDialog} session={session} />
               <div className="article max-w-[650px] lg:max-w-[680px] mx-auto">
                    <div className="article__container space-y-6">
                         <div className="article__header lg:text-xl">
                              {
                                   post?.cover && (
                                        <Image src={post?.cover} alt={post?.title} fill className="!relative w-full rounded-md" />
                                   )
                              }
                              <h1 className="article__title">{post?.title}</h1>
                              <div className="article__meta border-y py-2">
                                   <UserHoverCard user={author} >
                                        <Link href={`/@${author?.username}`}>
                                             <Avatar className="article__author-avatar border">
                                                  <AvatarImage src={author?.image} alt={author?.username} />
                                                  <AvatarFallback>{author?.username.charAt(0)}</AvatarFallback>
                                             </Avatar>
                                        </Link>
                                   </UserHoverCard>

                                   <div className="flex flex-col">
                                        <span className="article__author-name md:text-base text-sm">
                                             <UserHoverCard user={author} >
                                                  <Link href={`/@${author?.username}`}>
                                                       {author?.name || author?.username}
                                                       {author?.verified &&
                                                            (
                                                                 <Icons.verified className="h-4 w-4 mx-1 inline fill-primary align-middle" />
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
                                   <PostMoreActions post={post} session={session} >
                                        <Button className="h-10 w-10 mr-0.5 ml-auto flex md:hidden" size={"icon"} variant={"outline"}  >
                                             <MoreHorizontal className="w-5 h-5" strokeWidth={1.75} />
                                        </Button>
                                   </PostMoreActions>
                              </div>

                         </div>

                         <MarkdownCard code={post?.content} />


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

                         {
                              // if post word count is greater than 1000 show the stats
                              <PostTabs post={post} session={session} author={author} comments={post?.comments} onClicked={() => setOpenComments(!openComments)} />

                         }
                         <MobilePostTabs post={post} session={session} author={author} className="mt-8" comments={comments} onClicked={() => setOpenComments(!openComments)} />
                    </div>
               </div>
               <CommentsSheet post={post} comments={post?.comments} session={session} open={openComments} onOpenChange={setOpenComments} />
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
