'use client'
import { Icons } from "@/components/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import UserHoverCard from "@/components/user-hover-card";
import { Heart, MoreHorizontal, Pencil, Reply, Trash2 } from "lucide-react";
import Markdown from "markdown-to-jsx";
import Link from "next/link";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react";
import { usePathname } from "next/navigation";
import { handleCommentLike } from "@/components/like";
import CommentDeleteDialog from "./delete-dialog";
import CommentEditorForm from "./comment-editor-form";
import ReplyForm from "./reply-form";
import { Separator } from "@/components/ui/separator";
import { formatNumberWithSuffix } from "@/components/format-numbers";
import { getComment } from "@/lib/prisma/get-comment";
import MarkdownCard from "@/components/markdown-card";

export function dateFormat(dateString: string | number | Date) {
     const date = new Date(dateString);
     const currentDate = new Date();
   
     const differenceInTime = currentDate.getTime() - date.getTime();
     const differenceInDays = differenceInTime / (1000 * 3600 * 24);
   
     if (differenceInDays < 1) {
       const differenceInHours = differenceInTime / (1000 * 3600);
       if (differenceInHours < 1) {
         const differenceInMinutes = differenceInTime / (1000 * 60);
         if (differenceInMinutes < 1) {
           const differenceInSeconds = differenceInTime / 1000;
           return differenceInSeconds < 30 ? 'Just now': `${Math.floor(differenceInSeconds)}s`;
         }
         return `${Math.floor(differenceInMinutes)}m`;
       }
       return `${Math.floor(differenceInHours)}h`;
     }
   
     if (differenceInDays > 15) {
       return `${date.toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
       })}`;
     } else {
       return `${Math.floor(differenceInDays)}d`;
     }
}

async function fetchComment(commentId: number) {
     return await getComment(commentId);
}


export default function CommentCard({ comment: initialComment, post, session, ...props }: React.ComponentPropsWithoutRef<typeof Card> & { comment: any, post: any, session: any }) {
     const pathname = usePathname();
     const like = async (commentId: number) => {
          await handleCommentLike({ commentId, path: pathname });
     }
     const [comment, setComment] = React.useState<any>(initialComment);
     React.useEffect(() => {
          setComment(initialComment);
          if(initialComment.parentId) {
            (async () => {
              const fetchedComment = await fetchComment(initialComment.id);
              setComment(fetchedComment);
            })();
          }
        }, [initialComment]);

     const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
     const isLiked = comment.likes?.find((like: any) => like.authorId === session?.id)
     const [isReplying, setIsReplying] = React.useState<boolean>(false)
     const [isEditing, setIsEditing] = React.useState<boolean>(false)
     const [openReply, setOpenReply] = React.useState<boolean>(false)
     return (
          <div className="flex flex-col w-full">
               {
                    !isEditing ? (
                         <>
                              <Card className="article__comments-item-card w-full bg-background border-none shadow-none">
                                   <CardHeader className={`space-y-0 w-full text-sm flex-row items-center p-4 ${comment.parentId && 'pt-0'} px-0`}>
                                        <div className="flex justify-between w-full">
                                             <div className="w-full flex">
                                                  <UserHoverCard user={comment.author} className="h-6 w-6 mr-1 md:mr-1.5" >
                                                       <Link href={`/@${comment.author?.username}`} className="inline-block">
                                                            <Avatar className="h-6 w-6 border">
                                                                 <AvatarImage src={comment.author?.image} alt={comment.autho?.name} />
                                                                 <AvatarFallback>{comment.author?.name ? comment.author?.name.charAt(0) : comment.author?.username.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                       </Link>
                                                  </UserHoverCard>
                                                  <Link href={`/@${comment.author?.username}`} className="flex items-center">
                                                       <span className="article__comments-item-author text-sm">{comment.author?.name || comment.author?.username}</span>
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
                                                  session?.id === post.authorId && (
                                                       session?.id !== comment.authorId && (
                                                            (
                                                                 <DropdownMenu>
                                                                      <DropdownMenuTrigger>
                                                                           <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                                                                      </DropdownMenuTrigger>
                                                                      <DropdownMenuContent align="end">
                                                                           <DropdownMenuItem className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                                                                                onSelect={() => setShowDeleteAlert(true)} >
                                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                                <span>Delete</span>
                                                                           </DropdownMenuItem>
                                                                      </DropdownMenuContent>
                                                                 </DropdownMenu>

                                                            )
                                                       )
                                                  )
                                             }
                                             {
                                                  session?.id === comment.authorId && (
                                                       <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                 <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                 <DropdownMenuItem onClick={() => setIsEditing(true)} >
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

                                   <MarkdownCard code={comment.content} />
                                   </CardContent>
                                   <CardFooter className="flex-row items-center justify-between p-4 px-0">
                                        <div className="flex items-center space-x-2">
                                             <div className="flex items-center">
                                                  <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} disabled={session?.id == comment.authorId} onClick={() => like(comment.id)} >
                                                       <Heart className={`w-5 h-5 ${isLiked && 'fill-current'}`} strokeWidth={2} />
                                                  </Button>
                                                  <span className="text-sm">{formatNumberWithSuffix(comment?._count?.likes)}</span>
                                             </div>
                                             {
                                                  comment._count.replies > 0 && (
                                                       <div className="flex items-center">
                                                            <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} onClick={() => setOpenReply(!openReply)} >
                                                                 <Reply className="w-5 h-5" strokeWidth={2} />
                                                            </Button>
                                                            <span className="text-sm">{comment?._count.replies}</span>
                                                       </div>
                                                  )
                                             }
                                        </div>
                                        <div className="flex items-center">
                                             <Button className="mr-0.5" variant={"ghost"} onClick={() => setIsReplying(!isReplying)} >
                                                  Reply
                                             </Button>
                                        </div>
                                   </CardFooter>
                              </Card>
                              {
                                   openReply && (
                                        <div className="flex w-full justify-between space-y-4 before:bg-border before:w-[1px]">
                                             <div className="w-full ml-6">
                                                  {
                                                       comment?.replies?.map((reply: any, index: number) => (
                                                            <>
                                                            <CommentCard key={reply.id} comment={reply} post={post} session={session} />
                                                            { index !== comment?.replies?.length - 1 && <Separator className="w-full mb-4" /> }
                                                            </>
                                                       ))
                                                  }
                                             </div>
                                        </div>

                                   )
                              }
                         </>
                    ) : (
                         <CommentEditorForm
                              data={comment}
                              post={post}
                              session={session}
                              onCancel={() => setIsEditing(false)}
                              onUpdate={() => setIsEditing(false)}
                         />
                    )
               }
               {isReplying && (
                    <div className="flex w-full justify-between before:bg-border before:w-[1px]">
                         <ReplyForm
                              comment={comment}
                              post={post}
                              session={session}
                              onCanceled={() => setIsReplying(false)}
                              onReplied={() => setIsReplying(false)}
                         />
                    </div>
               )}
               <CommentDeleteDialog comment={comment} user={session} open={showDeleteAlert} onOpenChange={setShowDeleteAlert} />
          </div>
     )
}