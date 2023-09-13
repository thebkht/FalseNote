"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
     Avatar,
     AvatarFallback,
     AvatarImage,

} from "@/components/ui/avatar"
import { useSession } from "next-auth/react";
import { useUsername } from "../useUsername";
import { useEffect, useState } from "react";

export default function EditorNavbar() {
     const user = useSession().data?.user as any;
     const [name, setName] = useState("");
     useEffect(() => {
          setName(user.name);
     }, [user.name])
     const username = useUsername({ params: { name } });
     return (
          <nav className="menu">
               <div className="menu-backdrop h-[60px] border-b w-full">
               </div>
               <div className="menu-container p-3 xl:px-36 2xl:px-64">
                    
                         <Link href={`/${username}`} className="flex align-items-center">
                              <Avatar className="h-8 w-8 mr-1">
                                   <AvatarImage src={ user?.image } alt={ user?.name } />
                                   <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>

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