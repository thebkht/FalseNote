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
import { Bookmark, Facebook, Link2, Linkedin, MoreHorizontal } from "lucide-react";
import { LinkedInLogoIcon, FaceIcon, Cross2Icon } from "@radix-ui/react-icons";
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from "next-share";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import PostCard from "../tags/post-card-v2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BlurImage as Image } from "../image";
import { shimmer, toBase64 } from "@/lib/image";


export default function PublishDialog({ post, user, session, ...props }: { post: Post, user: User, session?: any } & React.ComponentPropsWithoutRef<typeof Dialog>) {
     const copylink = (link: string) => {
          navigator.clipboard.writeText(link)
          toast({
               description: 'Copied to clipboard',
          })
     }
     const url = `${process.env.DOMAIN}/@${user.username}/${post.url}`
     const text = `Check out my new post:\n${post.title}`
     return (
          <>
               <Dialog {...props} >
                    <DialogContent className="md:w-1/2">
                         <DialogHeader className="!text-center">
                              <DialogTitle>Your post is published!</DialogTitle>
                              <DialogDescription>
                                   Your post is now published and live on your profile. You can share it with the world now!
                              </DialogDescription>
                         </DialogHeader>
                         <div className="flex flex-col gap-2">
                              <Card className={cn("feedArticleCard bg-background max-h-72 my-8 w-full")}>
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
                                             <div className="stats flex items-center justify-around gap-1">
                                                  <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                                                       <Button variant="ghost" size={"icon"} className=" text-muted-foreground">
                                                            <Bookmark className={`h-5 w-5`} strokeWidth={2} />
                                                            <span className="sr-only">Save</span>
                                                       </Button>
                                                  </div>
                                                  <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                                                       <Button variant="ghost" size={"icon"} className=" text-muted-foreground">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                            <span className="sr-only">More</span>
                                                       </Button>
                                                  </div>
                                             </div>
                                        </div>
                                   </CardContent>
                              </Card>
                              <div className="flex flex-row flex-wrap items-center gap-2 w-full mx-auto mb-5">
                                   <div className="w-56">
                                        <TwitterShareButton
                                             url={url}
                                             title={text}
                                             style={{ width: '100%' }}
                                        >
                                             <div className={cn('flex justify-between w-full gap-2 !px-4', buttonVariants({ variant: 'outline', size: 'lg' }))}>
                                                  <Icons.twitter className="h-5 w-5 fill-current stroke-none" />
                                                  <span className="w-full">Share on Twitter</span>
                                                  <div className="h-5 w-5 fill-current stroke-none" />
                                             </div>
                                        </TwitterShareButton>
                                   </div>
                                   <div className="w-56">
                                        <FacebookShareButton
                                             url={url}
                                             quote={text}
                                             style={{ width: '100%' }}
                                        >
                                             <div className={cn('flex justify-between w-full gap-2 !px-4', buttonVariants({ variant: 'outline', size: 'lg' }))}>
                                                  <Facebook className="h-5 w-5 fill-current stroke-none" />
                                                  <span className="w-full">Share on Facebook</span>
                                                  <div className="h-5 w-5 fill-current stroke-none" />
                                             </div>
                                        </FacebookShareButton>
                                   </div>
                                   <div className="w-56">
                                        <LinkedinShareButton
                                             url={url}
                                             style={{ width: '100%' }}
                                        >
                                             <div className={cn('flex justify-between w-full gap-2 !px-4', buttonVariants({ variant: 'outline', size: 'lg' }))}>
                                                  <Linkedin className="h-5 w-5 fill-current stroke-none" />
                                                  <span className="w-full">Share on LinkedIn</span>
                                                  <div className="h-5 w-5 fill-current stroke-none" />
                                             </div>
                                        </LinkedinShareButton>
                                   </div>
                                   <div className="w-56">
                                        <Button onClick={() => copylink(url)} variant={'outline'} size={'lg'} className="w-full justify-between gap-2 !px-4" >
                                             <Link2 className="h-5 w-5" />
                                             <span className="w-full">Copy link</span>
                                             <div className="h-5 w-5 fill-current stroke-none" />
                                        </Button>
                                   </div>
                              </div>
                         </div>
                    </DialogContent>
               </Dialog>

          </>
     )
}