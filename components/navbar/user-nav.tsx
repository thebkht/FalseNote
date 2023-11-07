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
import { ArrowDownRight, ArrowRight, ChevronRight } from "lucide-react"

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
                         <Avatar className="h-8 w-8">
                              <AvatarImage src={user.image} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                    </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                         <Link href={username !== null ?  `/${username}` : `/`}>
                         <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">{user.name}</p>
                              {
                                   user.email && <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                              }
                         </div>
                         <DropdownMenuShortcut><ChevronRight className="h-5 w-5" /></DropdownMenuShortcut>
                    </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                         <Link href="/settings/profile">
                              <DropdownMenuItem>
                                   Settings
                                   <DropdownMenuShortcut>⇧⌘,</DropdownMenuShortcut>
                              </DropdownMenuItem>
                         </Link>
                         <Link href="/signout">
                         <DropdownMenuItem>
                              
                              
                              
                              Log out
                              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                         </DropdownMenuItem>
                         </Link>
                    </DropdownMenuGroup>
               </DropdownMenuContent>
          </DropdownMenu>
     )
}
