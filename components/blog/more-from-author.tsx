"use client"
import { formatNumberWithSuffix } from "../format-numbers";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useSession } from "next-auth/react";
import LoginDialog from "../login-dialog";
import { useEffect, useState } from "react";
import TagPostCard from "../tags/post-card";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "../icon";
import { validate } from "@/lib/revalidate";

export default function MoreFromAuthor({ author: initialAuthor, post: initialPost, sessionUser }: { author: any, post: any, sessionUser: any }) {
     const { status } = useSession();

     const [author, setAuthor] = useState(initialAuthor);
     const [post, setPost] = useState(initialPost);
     useEffect(() => {
          setPost(initialPost);
     }, [initialPost])
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
                  const followerId = sessionUser.id;
                  const result = await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
                      method: "GET",
                  }).then((res) => res.json());
                  if (!result.ok) {
                      setIsFollowing(!isFollowing);
                  }
                  await validate(path)
                  setIsFollowingLoading(false);
              } catch (error) {
                  console.error(error);
                  setIsFollowingLoading(false);
              }
          }
      }
     return (
          <>
               <div className="max-w-[680px] lg:text-xl mx-auto">
                    <div className="author__details flex flex-col gap-y-4">
                         <div className="mx-2 md:mx-6">
                              <Link href={`/@${author?.username}`} className="flex items-center">
                                   <Avatar className="h-20 w-20 mb-4 border">
                                        <AvatarImage src={author?.image} alt={author?.username} />
                                        <AvatarFallback>{author?.username.charAt(0)}</AvatarFallback>
                                   </Avatar>
                              </Link>
                              <div className="flex justify-between">
                                   <div className="gap-y-2">
                                        <div className="flex">
                                             <Link href={`/@${author?.username}`} className="flex items-center">
                                                  <h2 className="text-2xl font-medium">
                                                       {author?.name || author?.username} {author?.verified &&
                                                            (
                                                                 <Icons.verified className="h-5 w-5 mx-0.5 inline fill-primary align-middle" />
                                                            )}
                                                  </h2>
                                             </Link>

                                        </div>
                                        <div className="text-sm font-normal mt-2">{formatNumberWithSuffix(author?._count.Followers || 0)} Followers</div>
                                        {author?.bio && (<div className="text-sm font-normal mt-4">{author?.bio}</div>)}
                                   </div>
                                   <div>
                                        {sessionUser?.id !== author?.id && (
                                             status === "authenticated" ? (
                                                  <Button onClick={() => handleFollow(author.id)} disabled={isFollowingLoading}>{isFollowing ? "Following" : "Follow"}</Button>
                                             ) : (
                                                  <LoginDialog>
                                                       <Button >Follow</Button>
                                                  </LoginDialog>
                                             ))
                                        }
                                   </div>
                              </div>
                         </div>
                    </div>
                    {
                         post?.length !== 0 && (
                              <>
                                   <Separator className="my-10" />
                                   <div className="text-base font-medium mb-8 mx-2 md:mx-6">More From {author?.name || author?.username}</div>
                                   <div className="grid md:grid-cols-2 gap-4">
                                        {
                                             post?.map((p: any) => (
                                                  <TagPostCard key={p.id} post={p} session={sessionUser} />
                                             ))
                                        }
                                   </div>
                                   <Separator className="mb-6" />
                                   <Button variant={"outline"} className="w-full md:w-max" size={"lg"} asChild>
                                        <Link href={`/@${author?.username}`}>
                                             See all from {author?.name || author?.username}
                                        </Link>
                                   </Button>
                              </>
                         )
                    }
               </div>
          </>
     )
}