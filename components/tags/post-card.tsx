'use client'
import React from "react";
import {
     Card,
     CardContent,
     CardDescription,
     CardFooter,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Bookmark, BookmarkPlus, CalendarDays, Check, Eye, Heart, MessageCircle, MoreHorizontal, User } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import TagBadge from "../tags/tag";
import { dateFormat } from "@/lib/format-date";
import { formatNumberWithSuffix } from "../format-numbers";
import { usePathname } from "next/navigation";
import { handlePostSave } from "../bookmark";
import { handlePostLike } from "../like";
import PostMoreActions from "../blog/post-more-actions";
import LoginDialog from "../login-dialog";
import { Skeleton } from "../ui/skeleton";

export default function TagPostCard(
     { className, ...props }: React.ComponentPropsWithoutRef<typeof Card> & {
          post: any;
          className?: string;
          session: any;
     }
) {
     const pathname = usePathname();
     const save = async (postId: number) => {
          await handlePostSave({ postId, path: pathname });
     }
     const like = async (postId: number) => {
          await handlePostLike({ postId, path: pathname });
     }
     const isLiked = props.post?.likes?.some((like: any) => like.authorId === props.session?.id);
     const isSaved = props.post?.savedUsers?.some((savedUser: any) => savedUser.userId === props.session?.id);
     return (
          <Card {...props} className={cn('rounded-lg feedArticleCard bg-transparent border-none shadow-none md:pb-14', className)}>
               <CardContent className="md:p-6 p-2 md:px-4 h-full">
                    <div className="flex flex-col grid-cols-12 gap-y-8 items-start h-full pb-6">
                         <div className="w-full">
                              <Link href={`/${props.post.author?.username}/${props.post.url}`}>
                                   <div className="w-full h-auto bg-muted !relative !pb-0 aspect-[2/1]" >
                                        {props.post.cover ? (
                                             <>
                                                  <Image
                                                       src={props.post.cover}
                                                       fill
                                                       alt={props.post.title}
                                                       className="object-cover z-[1]"
                                                  />
                                                  <Skeleton className="w-full h-full rounded-md" />
                                             </>
                                        ) : (
                                             <Icons.noThumbnail className="h-full" />
                                        )}
                                   </div>
                              </Link>
                         </div>
                         <div className="col-span-12 flex flex-col justify-between space-y-4 h-full w-full">
                              <div className="flex items-center space-x-1">
                                   <UserHoverCard user={props.post.author} >
                                        <Link href={`/${props.post.author?.username}`} className="flex items-center space-x-0.5">
                                             <Avatar className="h-5 w-5 mr-0.5 border">
                                                  <AvatarImage src={props.post.author?.image} alt={props.post.author?.username} />
                                                  <AvatarFallback>{props.post.author?.name?.charAt(0) || props.post.author?.username?.charAt(0)}</AvatarFallback>
                                             </Avatar>
                                             <p className="text-sm font-normal leading-none">{props.post.author?.name || props.post.author?.username}</p>
                                             {props.post.author?.verified && (
                                                  <Icons.verified className="h-3 w-3 inline fill-primary align-middle" />
                                             )}
                                        </Link>
                                   </UserHoverCard>
                              </div>
                              <div className="flex">
                                   <div className="flex-initial w-full">
                                        <Link href={`/${props.post.author?.username}/${props.post.url}`}>
                                             <div>
                                                  <div className="pb-2">
                                                       <h2 className="text-base md:text-xl font-bold text-ellipsis overflow-hidden post__title custom">{props.post.title}</h2>
                                                  </div>
                                                  <div className="post-subtitle hidden md:block">
                                                       <p className="text-ellipsis text-base overflow-hidden post__subtitle text-muted-foreground">{props.post.subtitle}</p>
                                                  </div>
                                             </div>
                                        </Link>
                                   </div>
                              </div>
                              <div className="">
                                   <div className="flex justify-between items-center">
                                        <div className="flex flex-1 items-center space-x-1.5 text-muted-foreground text-sm">
                                             <span>
                                                  {props.post.readingTime}
                                             </span>
                                             <span>·</span>
                                             <span>{dateFormat(props.post.createdAt)}</span>
                                        </div>
                                   </div>
                              </div>
                              <div className="">
                                   <div className="flex justify-between items-center">
                                        <div className="flex flex-1 items-center space-x-2.5">
                                             <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                                                  {
                                                       props.session ? (
                                                            <Button variant="ghost" size={"icon"} className="h-8 w-8 text-muted-foreground" onClick={() => like(props.post.id)}>
                                                                 <Heart className={`w-5 h-5 ${isLiked && 'fill-current'}`} />
                                                                 <span className="sr-only">Like</span>
                                                            </Button>
                                                       ) : (
                                                            <LoginDialog>
                                                                 <Button variant="ghost" size={"icon"} className="h-8 w-8 text-muted-foreground">
                                                                      <Heart className={`w-5 h-5`} />
                                                                      <span className="sr-only">Like</span>
                                                                 </Button>
                                                            </LoginDialog>
                                                       )
                                                  }
                                                  <span>{formatNumberWithSuffix(props.post._count.likes)}</span>
                                             </div>
                                             <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                                                  <Link href={`/${props.post.author?.username}/${props.post.url}?commentsOpen=true`}>
                                                       <Button variant="ghost" size={"icon"} className="h-8 w-8 text-muted-foreground">
                                                            <MessageCircle className="w-5 h-5" />
                                                            <span className="sr-only">Comment</span>
                                                       </Button>
                                                  </Link>
                                                  <span>{formatNumberWithSuffix(props.post._count.comments)}</span>
                                             </div>
                                        </div>
                                        <div className="flex items-center justify-around gap-2">

                                             <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                                                  {
                                                       props.session ? (
                                                            <Button variant="ghost" size={"icon"} className="h-8 w-8 text-muted-foreground">
                                                                 <Bookmark className={`h-5 w-5 ${isSaved && 'fill-current'}`} onClick={() => save(props.post.id)} strokeWidth={2} />
                                                                 <span className="sr-only">Save</span>
                                                            </Button>
                                                       ) : (
                                                            <LoginDialog>
                                                                 <Button variant="ghost" size={"icon"} className="h-8 w-8 text-muted-foreground">
                                                                      <Bookmark className={`h-5 w-5`} strokeWidth={2} />
                                                                      <span className="sr-only">Save</span>
                                                                 </Button>
                                                            </LoginDialog>
                                                       )
                                                  }
                                             </div>
                                             <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                                                  <PostMoreActions post={props.post} session={props.session}>
                                                       <Button variant="ghost" size={"icon"} className=" text-muted-foreground">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                            <span className="sr-only">More</span>
                                                       </Button>
                                                  </PostMoreActions>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </CardContent>
          </Card>
     );
}

