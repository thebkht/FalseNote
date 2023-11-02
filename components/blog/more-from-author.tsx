"use client"
import { formatNumberWithSuffix } from "../format-numbers";
import PostCard from "./post-card";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useSession } from "next-auth/react";
import LoginDialog from "../login-dialog";
import { useEffect, useState } from "react";
import { getSessionUser } from "../get-session-user";
import TagPostCard from "../tags/post-card";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "../icon";

export default function MoreFromAuthor({ author: initialAuthor, post, sessionUser }: { author: any, post: any, sessionUser: any }) {
     const { status } = useSession();
     const [author, setAuthor] = useState(initialAuthor);
     useEffect(() => {
          setAuthor(initialAuthor);
     }, [initialAuthor])
     const [isFollowing, setIsFollowing] = useState<boolean | null>(author?.Followers?.some((follower: any) => follower.followerId === sessionUser?.id) || false);
     useEffect(() => {
          setIsFollowing(author?.Followers?.some((follower: any) => follower.followerId === sessionUser?.id) || false);
     }, [author, sessionUser])
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
     const path = usePathname();
     const router = useRouter();

     async function handleFollow(followeeId: string) {
          if (status === "authenticated") {
               setIsFollowingLoading(true);
               try {
                    setIsFollowing(!isFollowing);
                    const followerId = sessionUser?.id;
                    const result = await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
                         method: "GET",
                    }).then((res) => res.json());
                    if (!result.ok) {
                         setIsFollowing(!isFollowing);
                    }
                    await fetch(`/api/revalidate?path=${path}`)
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
                                                            <Link href={`/${author?.username}`} className="flex items-center">
                                                                 <h2 className="text-2xl font-medium">
                                                                      Written by {author?.name || author?.username}
                                                                 </h2>{author?.verified &&
                                                                 (
                                                                      <Icons.verified className="h-5 w-5 mx-1 inline fill-primary align-middle" />
                                                                 )}
                                                            </Link>
                                                            
                                                       </div>
                                                       <div className="text-sm font-normal mt-2">{formatNumberWithSuffix(author?.Followers.length || 0)} Followers</div>
                                                       {author?.bio && (<div className="text-sm font-normal mt-4">{author?.bio}</div>)}
                                                  </div>
                                                  <div>
                                                       {sessionUser?.id !== author?.id && (
                                                            status === "authenticated" ? (
                                                                 <Button variant={"secondary"} onClick={() => handleFollow(author.id)} disabled={isFollowingLoading}>{isFollowing ? "Following" : "Follow"}</Button>
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