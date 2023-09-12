"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
     Avatar,
     AvatarFallback,
     AvatarImage,

} from "@/components/ui/avatar"
import { useSession } from "next-auth/react";

export default function EditorNavbar() {
     const user = useSession().data?.user as any;
     return (
          <nav className="menu">
               <div className="menu-backdrop h-[60px] border-b w-full">
               </div>
               <div className="menu-container p-3 xl:px-36 2xl:px-64">
                    
                         <Link href="/user" className="flex align-items-center">
                              <Avatar className="h-8 w-8">
                                   <AvatarImage src={ user?.image } alt={ user?.name } />
                                   <AvatarFallback>BG</AvatarFallback>

                              </Avatar>
                              <Button variant="ghost" size={"sm"} asChild>
                              <div className="font-medium">
                                   { user?.name }
                              </div>
                              </Button>
                              
                         </Link>
               </div>
          </nav>
     );
}