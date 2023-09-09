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
                    <Button variant="ghost" size={""} asChild>
                         <Link href="/user" className="flex align-items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                   <AvatarImage src="https://avatars.githubusercontent.com/u/62228656" alt="@yusupovbg" />
                                   <AvatarFallback>BG</AvatarFallback>

                              </Avatar>

                              <div className="flex flex-col text-left space-y-1">
                                   <p className="text-sm font-medium leading-none">yusupovbg</p>
                              </div>
                         </Link>
                    </Button>
               </div>
          </nav>
     );
}