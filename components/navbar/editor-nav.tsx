"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
     Avatar,
     AvatarFallback,
     AvatarImage,

} from "@/components/ui/avatar"
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserByUsername } from "../get-user";
import { getSessionUser } from "../get-session-user";

export default function EditorNavbar() {
     const user = useSession().data?.user as any;

     return (
          <nav className="menu">
               <div className="menu-container fixed p-3.5 bg-background/60 backdrop-blur-md">
                    
                         <Link href={`/${user.name}`} className="flex align-items-center">
                              <Avatar className="h-8 w-8 mr-1">
                                   <AvatarImage src={ user?.image } alt={ user?.name } />
                                   <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>

                              </Avatar>
                              <Button variant="ghost" size={"sm"} className="hidden md:flex" asChild>
                              <div className="font-medium">
                                   { user?.name }
                              </div>
                              </Button>
                              
                         </Link>
               </div>
          </nav>
     );
}