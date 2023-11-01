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
import { Bookmark, BookmarkPlus, CalendarDays, Check, Eye, Heart, MessageCircle, User } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import TagBadge from "../tags/tag";
import { dateFormat } from "@/lib/format-date";
import { formatNumberWithSuffix } from "../format-numbers";

export default function TagPostCard(
     { className, ...props }: React.ComponentPropsWithoutRef<typeof Card> & {
          post: any;
          className?: string;
          session: any;
     }
) {
     return (
          <Card {...props} className={cn('rounded-lg feedArticleCard bg-background border-none shadow-none', className)}>
               <CardContent className="px-4 h-full">
                    <div className="flex flex-col grid-cols-12 gap-y-8 items-start h-full pb-14">
                         <div className="w-full">
                              <Link href={`/${props.post.author?.username}/${props.post.url}`}>
                                   <div className="w-full h-auto !relative !pb-0 aspect-[2/1] md:aspect-[3/2]" >
                                        {props.post.cover ? (
                                             <Image
                                                  src={props.post.cover}
                                                  fill
                                                  alt={props.post.title}
                                                  className="object-cover bg-muted"
                                             />
                                        ) : (
                                             <Icons.noThumbnail className="h-full" />
                                        )}
                                   </div>
                              </Link>
                         </div>
                         <div className="col-span-12 flex flex-col justify-between space-y-4 h-full">
                              <div className="flex items-center space-x-1">
                                   <UserHoverCard user={props.post.author} className="mr-1 md:mr-1.5" >
                                        <Link href={`/${props.post.author?.username}`} className="flex items-center">
                                             <Avatar className="h-5 w-5 mr-1 md:mr-1.5">
                                                  <AvatarImage src={props.post.author?.image} alt={props.post.author?.username} />
                                                  <AvatarFallback>{props.post.author?.name?.charAt(0) || props.post.author?.username?.charAt(0)}</AvatarFallback>
                                             </Avatar>
                                             {
                                                  props.post.author?.name === null ? (
                                                       <div>
                                                            <p className="text-sm font-normal leading-none">{props.post.author?.username} {props.post.author?.verified && (
                                                                 <Badge className="h-3 w-3 !px-0">
                                                                      <Check className="h-2 w-2 mx-auto" />
                                                                 </Badge>
                                                            )}</p>
                                                       </div>
                                                  ) : (
                                                       <div>
                                                            <p className="text-xs font-normal leading-none">{props.post.author?.name} {props.post.author?.verified && (
                                                                 <Badge className="h-3 w-3 !px-0">
                                                                      <Check className="h-2 w-2 mx-auto" />
                                                                 </Badge>
                                                            )}</p>
                                                       </div>
                                                  )
                                             }
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
                                                       <p className="text-ellipsis text-base overflow-hidden post__subtitle">{props.post.subtitle}</p>
                                                  </div>
                                             </div>
                                        </Link>
                                   </div>
                              </div>
                              <div className="">
                                   <div className="flex justify-between items-center">
                                        <div className="flex flex-1 items-center space-x-1.5 text-muted-foreground text-sm">
                                             <span>
                                                  {dateFormat(props.post.createdAt)}
                                             </span>
                                             <span>·</span>
                                             <span>{formatNumberWithSuffix(props.post.views)} views</span>
                                        </div>
                                   </div>
                              </div>
                              <div className="">
                                   <div className="flex justify-between items-center">
                                        <div className="flex flex-1 items-center space-x-2.5">
                                             <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                                                  <Button variant="ghost" size={"icon"} className="h-8 w-8 text-muted-foreground">
                                                       <Heart className="w-5 h-5" />
                                                  </Button>
                                                  <span>{formatNumberWithSuffix(props.post._count.likes)}</span>
                                             </div>
                                             <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                                                  <Button variant="ghost" size={"icon"} className="h-8 w-8 text-muted-foreground">
                                                       <MessageCircle className="w-5 h-5" />
                                                  </Button>
                                                  <span>{formatNumberWithSuffix(props.post._count.comments)}</span>
                                             </div>
                                        </div>
                                        <div className="stats flex items-center justify-around gap-2">

                                             <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                                                  <Button variant="ghost" size={"icon"} className="h-8 w-8 text-muted-foreground">
                                                       <Bookmark className="h-5 w-5" strokeWidth={2} />
                                                  </Button>
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

