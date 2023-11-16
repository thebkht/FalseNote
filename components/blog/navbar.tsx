'use client'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Pencil, ShareIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import ShareList from "../share-list";
import { usePathname } from "next/navigation";
import { handlePostLike } from "../like";
import { handlePostSave } from "../bookmark";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Link from "next/link";
import PostDeleteDialog from "./post-delete-dialog";
import LoginDialog from "../login-dialog";

export default function PostTabs({ post: initialPost, className, session, author, comments, onClicked }: { post: any, className?: string, session: any, author: any, comments: boolean | undefined, onClicked: () => void }) {
     const [post, setPost] = useState<any>(initialPost);
     useEffect(() => {
          setPost(initialPost);
     }, [initialPost])
     const pathname = usePathname();
     const like = async (postId: number) => {
          await handlePostLike({ postId, path: pathname });
     }
     const save = async (postId: number) => {
          await handlePostSave({ postId, path: pathname });
     }
     const isLiked = post?.likes?.some((like: any) => like.authorId === session?.id);
     const isSaved = post?.savedUsers?.some((savedUser: any) => savedUser.userId === session?.id);
     const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false)
     return (
          <>
               <div className={cn("px-2 py-1 border-y hidden md:flex justify-between w-full sticky top-[60px] bg-background", className)}>
                    <div className="flex items-center gap-3">
                         <div className="flex items-center">
                              {
                                   session ? (
                                        <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} onClick={() => like(post.id)} disabled={session.id == post.authorId} >
                                             <Heart className={`w-5 h-5 ${isLiked && 'fill-current'}`} strokeWidth={2} />
                                             <span className="sr-only">Like</span>
                                        </Button>
                                   ) : (
                                        <LoginDialog>
                                             <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} >
                                                  <Heart className={`w-5 h-5`} strokeWidth={2} />
                                                  <span className="sr-only">Like</span>
                                             </Button>
                                        </LoginDialog>
                                   )
                              }
                              <span className="text-sm">{post?._count.likes}</span>
                         </div>


                         
                              <div className="flex items-center">
                              <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} onClick={onClicked}>
                                        <MessageCircle className="w-5 h-5" strokeWidth={2} />
                                        <span className="sr-only">Comment</span>
                                   </Button>
                                   <span className="text-sm">{post?._count.comments}</span>
                              </div>
                         


                    </div>
                    <div className="flex items-center gap-1.5">
                         {
                              session ? (
                                   <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} >
                                        <Bookmark className={`w-5 h-5 ${isSaved && 'fill-current'}`} strokeWidth={2} onClick={() => save(post.id)} />
                                        <span className="sr-only">Save</span>
                                   </Button>
                              ) : (
                                   <LoginDialog>
                                        <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} >
                                             <Bookmark className={`w-5 h-5`} strokeWidth={2} />
                                             <span className="sr-only">Save</span>
                                        </Button>
                                   </LoginDialog>
                              )
                         }
                         <ShareList url={`https://falsenotes.netlify.app/${author?.username}/${post.url}`} text={post.title} >
                              <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} >
                                   <ShareIcon className="w-5 h-5" strokeWidth={2} />
                                   <span className="sr-only">Share</span>
                              </Button>
                         </ShareList>
                         {
                              session?.id === post?.authorId && (
                                   <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                             <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} >
                                                  <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
                                             </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                             <DropdownMenuItem asChild>
                                                  <Link href={`/editor/${post?.url}`}>
                                                       <Pencil className="mr-2 h-4 w-4" />
                                                       <span>Edit</span>
                                                  </Link>
                                             </DropdownMenuItem>
                                             <DropdownMenuSeparator />
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
               </div>
               <PostDeleteDialog post={post} user={session} open={showDeleteAlert} onOpenChange={setShowDeleteAlert} />
          </>
     )
}