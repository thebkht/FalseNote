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
import TagPostCard from "../tags/post-card";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Check } from "lucide-react";

export default function MoreFromAuthor({ author, post, sessionUser }: { author: any, post: any, sessionUser: any }) {
     const { status } = useSession();
     const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);

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
                              <div className="max-w-[680px] lg:text-xl mx-auto pt-10">
                                   <div className="author__details flex flex-col gap-y-4">
                                        <div className="mx-2 md:mx-6">
                                             <Avatar className="h-20 w-20 mb-4">
                                                  <AvatarImage src={author?.image} alt={author?.username} />
                                                  <AvatarFallback>{author?.username.charAt(0)}</AvatarFallback>
                                             </Avatar>
                                             <div className="flex justify-between">
                                                  <div className="gap-y-2">
                                                       <div className="flex">
                                                            <Link href={`/${author?.username}`}>
                                                                 <h2 className="text-2xl font-medium">
                                                                      Written by {author?.name || author?.username}
                                                                 </h2>
                                                            </Link>
                                                            {author?.verified &&
                                                                 (
                                                                      <Badge className="h-4 w-4 ml-2 !px-0"> <Check className="h-3 w-3 mx-auto" /></Badge>
                                                                 )}
                                                       </div>
                                                       <div className="text-sm font-normal mt-2">{formatNumberWithSuffix(author?.Followers.length || 0)} Followers</div>
                                                       {author?.bio && (<div className="text-sm font-normal mt-4">{author?.bio}</div>)}
                                                  </div>
                                                  <div>
                                                       {sessionUser?.id !== author?.id && (
                                                            status === "authenticated" ? (
                                                                 <Button variant={"secondary"} onClick={() => handleFollow(author.userid)} disabled={isFollowingLoading}>{isFollowing ? "Following" : "Follow"}</Button>
                                                            ) : (
                                                                 <LoginDialog>
                                                                      <Button variant={"secondary"} >Follow</Button>
                                                                 </LoginDialog>
                                                            ))
                                                       }
                                                  </div>
                                             </div>
                                        </div>
                                        <Separator className="my-10" />
                                        <div className="text-base font-medium mb-8 mx-2 md:mx-6">More From {author?.username}</div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                             {
                                                  post?.map((p: any) => (
                                                       <TagPostCard key={p.id} post={p} session={sessionUser} />
                                                  ))
                                             }
                                        </div>
                                        <Separator className="mb-6" />
                                        <Button variant={"outline"} className="w-full md:w-max" size={"lg"} asChild>
                                                  <Link href={`/${author?.username}`}>
                                                       See all from {author?.name || author?.username}
                                                  </Link>
                                             </Button>
                                   </div>
                                   
                              </div>
                         </>
                    )
               }
          </>
     )
}