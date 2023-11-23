'use client'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Pencil, ShareIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import CommentsSheet from "./comments/comments-sheet";
import ShareList from "../share-list";
import { usePathname } from "next/navigation";
import { handlePostLike } from "../like";
import { handlePostSave } from "../bookmark";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Link from "next/link";
import PostDeleteDialog from "./post-delete-dialog";
import LoginDialog from "../login-dialog";
import { Separator } from "../ui/separator";

export default function MobilePostTabs({ post: initialPost, className, session, author, onClicked }: { post: any, className?: string, session: any, author: any, onClicked: () => void }) {
     const [post, setPost] = useState<any>(initialPost);
     useEffect(() => {
          setPost(initialPost);
     }, [initialPost])
     const pathname = usePathname();
     const like = async (postId: string) => {
          await handlePostLike({ postId, path: pathname });
     }
     const save = async (postId: string) => {
          await handlePostSave({ postId, path: pathname });
     }
     const isLiked = post?.likes?.some((like: any) => like.authorId === session?.id);
     const isSaved = post?.savedUsers?.some((savedUser: any) => savedUser.userId === session?.id);
     const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false)
     return (
          <>
               <div className={cn("p-2 border rounded-full shadow-xl flex md:hidden mx-auto w-max sticky bottom-5 bg-background/60 backdrop-blur-md", className)}>
                    <div className="flex items-center justify-between w-full gap-6 px-6">
                         <div className="flex items-center justify-center flex-1">
                              {
                                   session ? (
                                        <Button className="h-10 w-10 mr-0.5 rounded-full hover:bg-primary hover:text-primary-foreground" size={"icon"} variant={"ghost"} onClick={() => like(post.id)} disabled={session.id == post.authorId} >
                                             <Heart className={`w-5 h-5 ${isLiked && 'fill-current'}`} strokeWidth={1.75} />
                                        </Button>
                                   ) : (
                                        <LoginDialog>
                                             <Button className="h-10 w-10 mr-0.5 rounded-full hover:bg-primary hover:text-primary-foreground" size={"icon"} variant={"ghost"} >
                                                  <Heart className={`w-5 h-5`} strokeWidth={1.75} />
                                             </Button>
                                        </LoginDialog>
                                   )
                              }
                              <span className="text-sm">{post?._count.likes}</span>
                         </div>
                         <Separator orientation="vertical" />
                         <div className="flex items-center justify-center flex-1">
                              <Button className="h-10 w-10 mr-0.5 rounded-full hover:bg-primary hover:text-primary-foreground" size={"icon"} variant={"ghost"} onClick={onClicked}>
                                   <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
                              </Button>
                              <span className="text-sm">{post?._count.comments}</span>
                         </div>
                         <Separator orientation="vertical" />
                         <div className="flex items-center justify-center flex-1">
                              {
                                   session ? (
                                        <Button className="h-10 w-10 mr-0.5 rounded-full hover:bg-primary hover:text-primary-foreground" size={"icon"} variant={"ghost"} >
                                             <Bookmark className={`w-5 h-5 ${isSaved && 'fill-current'}`} strokeWidth={1.75} onClick={() => save(post.id)} />
                                        </Button>
                                   ) : (
                                        <LoginDialog>
                                             <Button className="h-10 w-10 mr-0.5 rounded-full hover:bg-primary hover:text-primary-foreground" size={"icon"} variant={"ghost"} >
                                                  <Bookmark className={`w-5 h-5`} strokeWidth={1.75} />
                                             </Button>
                                        </LoginDialog>
                                   )
                              }
                         </div>
                         {/* <PostMoreActions post={post} session={session} >
                              <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} >
                                   <MoreHorizontal className="w-5 h-5" strokeWidth={1.75} />
                              </Button>
                         </PostMoreActions> */}
                    </div>
               </div>
               <PostDeleteDialog post={post} user={session} open={showDeleteAlert} onOpenChange={setShowDeleteAlert} />
          </>
     )
}