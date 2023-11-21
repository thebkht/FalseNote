"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, MenuIcon, Plus, SearchIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "./user-nav";
import { Icons } from "@/components/icon";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { use, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import SearchBar from "../searchbar";
import { useRouter } from "next/navigation";
import { PostCreateButton } from "./post-create-button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

function Navbar(notifications: any) {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="md:container px-4 sticky top-4 z-20">
      <div className="menu-container py-4 px-8 bg-background/70 backdrop-blur-md border rounded-2xl shadow-xl xl:mx-8">
      <Link href={session ? "/feed" : "/"} className="flex items-center">
        <Icons.logo className="md:block hidden" />
        <Icons.logoIcon className="md:hidden block" />
        <Badge className="ml-2 md:ml-3 px-1 py-0" variant={"secondary"}>Beta</Badge>
      </Link>

      <div className="flex items-center gap-1 md:gap-4">
        <Button variant="ghost" size={"icon"} className="flex md:hidden" asChild>
          <Link href="/explore">
            <MagnifyingGlassIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Search</span>
          </Link>
        </Button>
        <SearchBar />
        {
          status == 'authenticated' ? (
            <>
              <PostCreateButton key={"New Post"} variant="ghost" size={"icon"} />
              <Button variant={"ghost"} size={"icon"} onClick={() => router.replace('/notifications')}>
                <Bell className="w-[1.25rem] h-[1.25rem]" strokeWidth={1.75} />
                {notifications.notifications && notifications.notifications.length > 0 && (<Badge className="ml-2 md:ml-6 font-normal px-1 py-0 absolute mb-3 border-[3px] border-solid border-secondary" >{notifications.notifications.length}</Badge>)}
              </Button>
              <UserNav />
            </>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <Button onClick={() => router.replace('/signin')}>
                Join
              </Button>
            </div>
          )
        }

      </div>
    </div>
    </div>
  );
}

export default Navbar;