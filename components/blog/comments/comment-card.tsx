import { Icons } from "@/components/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import UserHoverCard from "@/components/user-hover-card";
import { dateFormat } from "@/lib/format-date";
import { Flag, Heart, MoreHorizontal, Pencil, Reply, Trash2 } from "lucide-react";
import Markdown from "markdown-to-jsx";
import Link from "next/link";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react";


export default function CommentCard({ comment, post, session, ...props }: React.ComponentPropsWithoutRef<typeof Card> & { comment: any, post: any, session: any }) {
     const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
     const isLiked = comment.likes.find((like: any) => like.userId === session?.id)
     return (
          <Card className="article__comments-item-card w-full bg-background border-none shadow-none">
               <CardHeader className="space-y-0 w-full text-sm flex-row items-center p-4 px-0">
                    <div className="flex justify-between w-full">
                         <div className="w-full flex">
                              <UserHoverCard user={comment.author} className="h-6 w-6 mr-1 md:mr-1.5" >
                                   <Link href={`/${comment.author.username}`} className="inline-block">
                                        <Avatar className="h-6 w-6">
                                             <AvatarImage src={comment.author.image} alt={comment.author.name} />
                                             <AvatarFallback>{comment.author.name ? comment.author.name.charAt(0) : comment.author.username.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                   </Link>
                              </UserHoverCard>
                              <Link href={`/${comment.author.username}`} className="flex items-center">
                                   <span className="article__comments-item-author text-sm">{comment.author.name || comment.author.username}</span>
                                   {comment.author?.verified &&
                                        (
                                             <Icons.verified className="h-4 w-4 mx-1 inline fill-primary align-middle" />
                                        )}
                                   {comment.author?.id === post?.authorId && (
                                        <Badge className="ml-1 text-[10px] py-0">Author</Badge>
                                   )}
                              </Link>
                              <span className="mx-1.5 !mt-0 text-sm">·</span>
                              <span className="article__comments-item-date text-muted-foreground text-sm !mt-0">{dateFormat(comment.createdAt)}</span>
                         </div>
                         {
                              session?.id === comment.authorId && (
                                   <DropdownMenu>
                                        <DropdownMenuTrigger>
                                             <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                             <DropdownMenuItem >
                                             <Pencil className="mr-2 h-4 w-4" />
                                                       <span>Edit</span>
                                             </DropdownMenuItem>
                                             <DropdownMenuItem className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                                                  onSelect={() => setShowDeleteAlert(true)} >
                                                  <Trash2 className="mr-2 h-4 w-4" />
                                                  <span>Delete</span>
                                             </DropdownMenuItem>
                                        </DropdownMenuContent>
                                   </DropdownMenu>

                              )
                         }
                    </div>
               </CardHeader>
               <CardContent className="p-4 pt-0 px-0">

                    <div className="article__comments-item-body text-sm prose-neutral markdown-body dark:prose-invert prose-img:rounded-xl prose-a:text-primary prose-code:bg-muted prose-pre:bg-muted prose-code:text-foreground prose-pre:text-foreground !max-w-full prose lg:prose-xl">
                         <Markdown>{comment.content}</Markdown>
                    </div>
               </CardContent>
               <CardFooter className="flex-row items-center justify-between p-4 px-0">
                    <div className="flex items-center">
                         <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"}  >
                              <Heart className={`w-5 h-5 ${isLiked && 'fill-current'}`} strokeWidth={2} />
                         </Button>
                         <span className="text-sm">{post?._count.likes}</span>
                    </div>
               </CardFooter>
          </Card>
     )
}