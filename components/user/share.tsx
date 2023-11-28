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
import { Facebook, Link2, Linkedin } from "lucide-react";


export default function ShareList({ className, children, url, text, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenu> & { children: React.ReactNode, className?: string, url: string, text: string }) {
     const copylink = (link: string) => {
          navigator.clipboard.writeText(link)
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
                         <DropdownMenuItem>
                              <TwitterShareButton
                                   url={url}
                                   title={text}
                                   >
                                   <div className="flex">
                                   <Icons.twitter className="mr-2 h-4 w-4 fill-current stroke-none" />
                                   <span>Share on Twitter</span>
                                   </div>
                              </TwitterShareButton>
                         </DropdownMenuItem>
                         <DropdownMenuItem>
                              <FacebookShareButton
                                   url={url}
                                   quote={text} >
                                   <div className="flex">
                                   <Facebook className="mr-2 h-4 w-4 fill-current stroke-none" />
                                   <span>Share on Facebook</span>
                                   </div>
                              </FacebookShareButton>
                         </DropdownMenuItem>
                         <DropdownMenuItem>
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