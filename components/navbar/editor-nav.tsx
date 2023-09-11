import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
     Avatar,
     AvatarFallback,
     AvatarImage,

} from "@/components/ui/avatar"

export default function EditorNavbar() {
     return (
          <nav className="menu">
               <div className="menu-backdrop h-[60px] border-b w-full">
               </div>
               <div className="menu-container p-3 xl:px-36 2xl:px-64">
                    
                         <Link href="/user" className="flex align-items-center">
                              <Avatar className="h-8 w-8">
                                   <AvatarImage src="https://avatars.githubusercontent.com/u/62228656" alt="@yusupovbg" />
                                   <AvatarFallback>BG</AvatarFallback>

                              </Avatar>
                              <Button variant="ghost" size={"sm"} asChild>
                              <div className="font-medium">
                              yusupovbg
                              </div>
                              </Button>
                              
                         </Link>
               </div>
          </nav>
     );
}