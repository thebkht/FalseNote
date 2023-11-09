import { Post } from "@prisma/client";
import { Dialog } from "../ui/dialog";
import {
     Facebook,
     Link2,
     Linkedin,
     Pencil,
     Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuGroup,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuPortal,
     DropdownMenuSeparator,
     DropdownMenuShortcut,
     DropdownMenuSub,
     DropdownMenuSubContent,
     DropdownMenuSubTrigger,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import {
     TwitterShareButton,
     FacebookShareButton,
     LinkedinShareButton
} from 'next-share'
import { Icons } from "../icon";
import React from "react";
import { handleDelete } from "../delete";
import { useRouter } from "next/navigation";
import PostDeleteDialog from "./post-delete-dialog";

export default function PostMoreActions({ post, session, className, children, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenu> & { post: any, session: any, className?: string }) {
     const copylink = (link: string) => {
          navigator.clipboard.writeText(link)
     }
     const router = useRouter()
     const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
     return (
          <>
               <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    {children}
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                    {
                         session?.id === post?.authorId && (
                              <DropdownMenuGroup>
                                   <DropdownMenuItem asChild>
                                        <Link href={`/editor/${post?.url}`}>
                                             <Pencil className="mr-2 h-4 w-4" />
                                             <span>Edit</span>
                                        </Link>
                                   </DropdownMenuItem>
                                   <DropdownMenuItem className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteAlert(true)} >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                   </DropdownMenuItem>
                                   <DropdownMenuSeparator />
                              </DropdownMenuGroup>
                         )
                    }
                    <DropdownMenuGroup>
                         <DropdownMenuItem onClick={() => copylink(`https://falsenotes.netlify.app/${post.author.username}/${post.url}`)}>
                              <Link2 className="mr-2 h-4 w-4" />
                              <span>Copy link</span>
                         </DropdownMenuItem>
                         <DropdownMenuItem>
                              <TwitterShareButton
                                   url={`https://falsenotes.netlify.app/${post.author.username}/${post.url}`}
                                   title={post.title}
                                   via="FalseNotesTeam" >
                                   <div className="flex">
                                   <Icons.twitter className="mr-2 h-4 w-4 fill-current stroke-none" />
                                   <span>Share on Twitter</span>
                                   </div>
                              </TwitterShareButton>
                         </DropdownMenuItem>
                         <DropdownMenuItem>
                              <FacebookShareButton
                                   url={`https://falsenotes.netlify.app/${post.author.username}/${post.url}`}
                                   quote={post.title} >
                                   <div className="flex">
                                   <Facebook className="mr-2 h-4 w-4 fill-current stroke-none" />
                                   <span>Share on Facebook</span>
                                   </div>
                              </FacebookShareButton>
                         </DropdownMenuItem>
                         <DropdownMenuItem>
                              <LinkedinShareButton
                                   url={`https://falsenotes.netlify.app/${post.author.username}/${post.url}`} >
                                   <div className="flex">
                                   <Linkedin className="mr-2 h-4 w-4 fill-current stroke-none" />
                                   <span>Share on LinkedIn</span>
                                   </div>
                              </LinkedinShareButton>
                         </DropdownMenuItem>
                    </DropdownMenuGroup>
               </DropdownMenuContent>
          </DropdownMenu>
          <PostDeleteDialog post={post} user={session} open={showDeleteAlert} onOpenChange={setShowDeleteAlert} />
          </>
     )
}