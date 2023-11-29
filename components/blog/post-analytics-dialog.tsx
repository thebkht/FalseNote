import { Post, User } from "@prisma/client";
import React from "react";
import {
     Dialog,
     DialogClose,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "../ui/button";
import { Icons } from "../icon";
import { BarChart2, Bookmark, Facebook, Link2, Linkedin, MoreHorizontal } from "lucide-react";
import { LinkedInLogoIcon, FaceIcon, Cross2Icon } from "@radix-ui/react-icons";
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from "next-share";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import PostCard from "../tags/post-card-v2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BlurImage as Image } from "../image";
import { shimmer, toBase64 } from "@/lib/image";
import { formatNumberWithSuffix } from "../format-numbers";


export default function PostAnalyticsDialog({ post, session, ...props }: { post: any, session?: any } & React.ComponentPropsWithoutRef<typeof Dialog>) {
     return (
          <>
               <Dialog {...props} >
                    <DialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-primary">
                              <BarChart2 className={`h-5 w-5`} />
                              <span className="sr-only">Analytics</span>
                         </Button>
                    </DialogTrigger>
                    <DialogContent className="md:w-1/2">
                         <DialogHeader className="!text-center">
                              <DialogTitle>Post Analytics</DialogTitle>
                         </DialogHeader>
                         <div className="flex flex-col gap-4 md:gap-8">
                              <Card className={cn("feedArticleCard bg-background max-h-72 w-full")}>
                                   <CardContent className="flex flex-col">
                                        <div className="flex justify-between items-start">
                                             <CardHeader className={cn("px-0 pb-3")}>
                                                  <CardTitle className="!text-base md:text-xl font-bold text-ellipsis overflow-hidden line-clamp-2">
                                                       {post.title}
                                                  </CardTitle>
                                                  <CardDescription className="text-ellipsis overflow-hidden line-clamp-2 text-muted-foreground">
                                                       {post.subtitle}
                                                  </CardDescription>
                                             </CardHeader>
                                             {post.cover && (<div className="flex-none ml-6 md:ml-8 pt-6">
                                                  <div className={`h-14 md:h-28 !relative bg-muted !pb-0 aspect-square overflow-hidden rounded-md`} >

                                                       <Image
                                                            src={post.cover}
                                                            fill
                                                            alt={post.title}
                                                            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`}
                                                            className="object-cover max-w-full h-auto z-[1] rounded-md"
                                                       />

                                                  </div>
                                             </div>
                                             )}
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                             <div className="flex flex-1 items-center space-x-2.5">
                                                  <p className="card-text mb-0 py-0.5 text-muted-foreground text-xs">{post.readingTime}</p>
                                             </div>
                                        </div>
                                   </CardContent>
                              </Card>
                              <Card>
                                   <CardContent className="flex flex-row items-center justify-between w-full pt-6">
                                        <div className="flex flex-col items-center gap-2 flex-1">
                                             <Icons.eye className="h-5 w-5 text-sm text-muted-foreground">Views</Icons.eye>
                                             <span className="text-2xl font-bold">{formatNumberWithSuffix(post.views)}</span>

                                        </div>
                                        <div className="flex flex-col items-center gap-2 flex-1">
                                             <Icons.like className="h-5 w-5 text-sm text-muted-foreground">Likes</Icons.like>
                                             <span className="text-2xl font-bold">{formatNumberWithSuffix(post._count.likes)}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2 flex-1">
                                             <Icons.commentBubble className="h-5 w-5 text-sm text-muted-foreground">Comments</Icons.commentBubble>
                                             <span className="text-2xl font-bold">{formatNumberWithSuffix(post._count.comments)}</span>

                                        </div>
                                        <div className="flex flex-col items-center gap-2 flex-1">
                                             <Icons.bookmark className="h-5 w-5 text-sm text-muted-foreground">Saves</Icons.bookmark>
                                             <span className="text-2xl font-bold">{formatNumberWithSuffix(post._count.savedUsers)}</span>

                                        </div>
                                        <div className="flex flex-col items-center gap-2 flex-1">
                                             <Icons.paperAirplane className="h-5 w-5 text-sm text-muted-foreground">Shares</Icons.paperAirplane>
                                             <span className="text-2xl font-bold">{formatNumberWithSuffix(post._count.shares)}</span>

                                        </div>
                                   </CardContent>
                              </Card>
                         </div>
                    </DialogContent>
               </Dialog>

          </>
     )
}