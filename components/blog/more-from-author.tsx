"use client"
import { formatNumberWithSuffix } from "../format-numbers";
import PostCard from "./post-card";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useSession } from "next-auth/react";
import LoginDialog from "../login-dialog";
import { useState } from "react";
import { getSessionUser } from "../get-session-user";

export default function MoreFromAuthor({ author, post, sessionUser }: { author: any, post: any, sessionUser: any }) {
     const { status } = useSession();
     const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);

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
                    if (result.message === "followed") {
                         author.followers = author.followers + 1;
                    } else if (result.message === "unfollowed") {
                         author.followers = author.followers - 1;
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
               {
                    post.length !== 0 && (
                         <>
                              <Separator className="my-8" />
                              <div className="max-w-[65ch] lg:text-xl mx-auto">
                                   <div className="author__details flex flex-col gap-y-4">
                                        <Avatar className="h-20 w-20">
                                             <AvatarImage src={author?.image} alt={author?.username} />
                                             <AvatarFallback>{author?.username.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex">
                                             <div className="flex flex-col gap-y-2">
                                                  <span className="text-2xl font-medium">Written by {author?.name || author?.username}</span>
                                                  <span className="text-sm font-normal">{formatNumberWithSuffix(author?.followers || 0)} Followers</span>
                                             </div>
                                             <div className="ml-auto">
                                                  {
                                                       status === "authenticated" && sessionUser?.id !== author?.id ? (
                                                            <Button className="ml-auto" variant={"secondary"} size={"lg"} onClick={() => handleFollow(author.userid)} disabled={isFollowingLoading}>{isFollowing ? "Following" : "Follow"}</Button>
                                                       ) : (
                                                            <LoginDialog>
                                                                 <Button className="ml-auto" variant={"secondary"} size={"lg"}>Follow</Button>
                                                            </LoginDialog>
                                                       )
                                                  }
                                             </div>
                                        </div>
                                        {author?.bio && (<span className="text-sm font-normal">{author?.bio}</span>)}
                                        <div className="text-base font-medium mb-4">More From {author?.username}</div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                             {
                                                  post?.map((p: any) => (
                                                       <PostCard
                                                            key={p.id}
                                                            title={p.title}
                                                            thumbnail={p.cover}
                                                            content={p.description}
                                                            author={author?.username || author?.name}
                                                            date={p.createdAt}
                                                            views={formatNumberWithSuffix(p.views)}
                                                            comments={formatNumberWithSuffix(p.comments || 0)}
                                                            id={p.id}
                                                            authorid={author?.userid}
                                                            session={sessionUser}
                                                            likes={formatNumberWithSuffix(p.likes || 0)}
                                                            url={`/${author?.username}/${p.url}`}
                                                            posturl={p.url} className="bg-transparent !border-none hover:bg-transparent" />
                                                  ))
                                             }
                                        </div>
                                   </div>
                              </div>
                         </>
                    )
               }
          </>
     )
}