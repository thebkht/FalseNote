'use client'
import { Bookmark, Heart, MessageCircle, ShareIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import CommentsSheet from "./comments/comments-sheet";
import ShareList from "../share-list";
import { usePathname } from "next/navigation";
import { handlePostLike } from "../like";
import { handlePostSave } from "../bookmark";

export default function PostTabs({ post, className, session, author }: { post: any, className?: string, session: any, author: any }) {
     const pathname = usePathname();
     const like = async (postId: number) => {
          console.log('liking')
          await handlePostLike({ postId, path: pathname });
     }
     const save = async (postId: number) => {
          console.log('liking')
          await handlePostSave({ postId, path: pathname });
     }
     const isLiked = post?.likes?.some((like: any) => like.authorId === session?.id);
     const isSaved = post?.savedUsers?.some((savedUser: any) => savedUser.userId === session?.id);
     return (
          <>
               <div className={cn("px-2 py-1 mt-8 border-y flex justify-between w-full sticky top-[60px] z-[10]", className)}>
                    <div className="flex items-center gap-3">
                         <div className="flex items-center">
                              <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} onClick={() => like(post.id)} >
                                   <Heart className={`w-5 h-5 ${isLiked && 'fill-current'}`} strokeWidth={2} />
                              </Button>
                              <span className="text-sm">{post?._count.likes}</span>
                         </div>

                         <CommentsSheet post={post} comments={post?.comments} session={session}>
                              <div className="flex items-center">
                                   <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} >
                                        <MessageCircle className="w-5 h-5" strokeWidth={2} />
                                   </Button>
                                   <span className="text-sm">{post?._count.comments}</span>
                              </div>
                         </CommentsSheet>

                    </div>
                    <div className="flex items-center gap-3">
                    <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} >
                                   <Bookmark className={`w-5 h-5 ${isSaved && 'fill-current'}`} strokeWidth={2} onClick={() => save(post.id)} />
                              </Button>
                         <ShareList url={`${process.env.DOMAIN}/${author?.username}/${post.url}`} text={post.title} >
                              <Button className="h-10 w-10 mr-0.5" size={"icon"} variant={"ghost"} >
                                   <ShareIcon className="w-5 h-5" strokeWidth={2} />
                              </Button>
                         </ShareList>
                    </div>
               </div>
          </>
     )
}