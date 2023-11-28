import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
     TwitterShareButton,
     FacebookShareButton,
     LinkedinShareButton
} from 'next-share'
import { Icons } from "@/components/icon";
import { Facebook, Linkedin } from "lucide-react";
import { Post } from "@prisma/client";
import { addShare } from "@/lib/prisma/add-share";


export default function ShareList({ className, children, url, text, post, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenu> & { children: React.ReactNode, className?: string, url: string, text: string, post: Post['id'] }) {
     const copylink = async(link: string) => {
          navigator.clipboard.writeText(link)
          await addShare(post)
     }
     return (
          <>
               <DropdownMenu {...props}>
                    <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => copylink(url)}>
                              <Icons.link className="mr-2 h-4 w-4" />
                              <span>Copy link</span>
                         </DropdownMenuItem>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem onClick={async() => await addShare(post)}>
                              <TwitterShareButton
                                   url={url}
                                   title={text}
                                   via="FalseNotesTeam"
                                   >
                                   <div className="flex">
                                   <Icons.twitter className="mr-2 h-4 w-4 fill-current stroke-none" />
                                   <span>Share on Twitter</span>
                                   </div>
                              </TwitterShareButton>
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={async() => await addShare(post)}>
                              <FacebookShareButton
                                   url={url}
                                   quote={text} >
                                   <div className="flex">
                                   <Facebook className="mr-2 h-4 w-4 fill-current stroke-none" />
                                   <span>Share on Facebook</span>
                                   </div>
                              </FacebookShareButton>
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={async() => await addShare(post)}>
                              <LinkedinShareButton
                                   url={url} >
                                   <div className="flex">
                                   <Linkedin className="mr-2 h-4 w-4 fill-current stroke-none" />
                                   <span>Share on LinkedIn</span>
                                   </div>
                              </LinkedinShareButton>
                         </DropdownMenuItem>
                    </DropdownMenuContent>
               </DropdownMenu>

          </>
     )
}