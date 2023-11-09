"use client"
import {
     Avatar,
     AvatarFallback,
     AvatarImage,

} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuGroup,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuShortcut,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getUserByUsername } from "../get-user"
import { getSessionUser } from "../get-session-user"
import { ArrowDownRight, ArrowRight, ChevronRight, Cog, LogOut, Settings, Settings2 } from "lucide-react"

export function UserNav() {
     const { status } = useSession();
     const user = useSession().data?.user as any;
     const [username, setUsername] = useState<string | null>(null);

useEffect(() => {
     async function fetchData() {
          try {
               const userData = (await getSessionUser())?.username;
               setUsername(userData ?? null);
          } catch (error) {
               // Handle errors
               console.error('Error:', error);
          }
     }

     if (status === "authenticated") {
          fetchData();
     }
}, [status, user?.name]);

     return (
          <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                         <Avatar className="h-8 w-8 border">
                              <AvatarImage src={user.image} alt={user.name} />
                              <AvatarFallback>{user.name?.charAt(0) || user.username?.charAt(0)}</AvatarFallback>
                         </Avatar>
                    </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-72 p-3" align="end" forceMount>
                    <DropdownMenuLabel className="flex items-center">
                    <Avatar className="mr-2 border">
                              <AvatarImage src={user.image} alt={user.name} />
                              <AvatarFallback>{user.name?.charAt(0) || user.username?.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div className="flex flex-col space-y-1">
                              <p className="text-xl font-bold leading-none">{user.name}</p>
                         </div>
                    </DropdownMenuLabel>
                    <div className="text-muted-foreground font-medium mt-4 mb-3.5 px-2.5">Profile</div>
                    <DropdownMenuItem asChild>
                         
                         <Link href={username !== null ?  `/${username}` : `/`} className="flex px-2.5 mb-4 py-2 border items-center">
                         <Avatar className="h-6 w-6 mr-2 border">
                              <AvatarImage src={user.image} alt={user.name} />
                              <AvatarFallback>{user.name?.charAt(0) || user.username?.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div className="flex flex-col space-y-1">
                              <p className="leading-none">{user.name}</p>
                         </div>
                         <DropdownMenuShortcut><ChevronRight className="h-5 w-5" /></DropdownMenuShortcut>
                    </Link>
                    </DropdownMenuItem>
                    <DropdownMenuGroup>
                         
                              <DropdownMenuItem className="px-2.5 py-2" asChild>
                                   <Link href="/settings/profile">
                                   <Cog className="h-5 w-5 mr-2" strokeWidth={1.5} />
                                   Settings
                                   <DropdownMenuShortcut>⇧⌘,</DropdownMenuShortcut>
                                   </Link>
                              </DropdownMenuItem>
                         
                         
                         <DropdownMenuItem className="px-2.5 py-2" asChild>
                             <Link href="/signout"> 
                             <LogOut className="h-5 w-5 mr-2" />
                              Log out
                              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                              </Link>
                         </DropdownMenuItem>
                         
                    </DropdownMenuGroup>
               </DropdownMenuContent>
          </DropdownMenu>
     )
}
