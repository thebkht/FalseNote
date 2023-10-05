"use client"

import { Button } from "@/components/ui/button";
import { items } from "./items";
import Link from "next/link";
import { MenuIcon, Plus, SearchIcon } from "lucide-react";
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
import { get } from "http";
import { getSessionUser } from "../get-session-user";
import { Command } from "@/components/ui/command"
import { Notifications } from "./notifications";
import { tr } from "date-fns/locale";

function Navbar() {
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any | null>(null);
  const user = session?.user;
  const router = useRouter();
  useEffect(() => {
    if (status !== "loading") {
      setIsLoaded(true);
    }
  }, [status]);

  useEffect(() => {
    async function getNotifications(){
      const sessionUser = await getSessionUser();
      try {
        const notificationsData = await fetch(`/api/notifications?user_id=${sessionUser.userid}`, {
          method: "GET",
        });
        const notifications = await notificationsData.json();
        setNotifications(notifications);
      } catch (error) {
        console.error(error);
      }
    }
    getNotifications();
  }, [])

  if (isLoaded) {
    return (
      <nav className="menu">
        <div className="menu-backdrop h-[64px] border-b w-screen md:w-full">
        </div>
        <div className="menu-container p-3.5 xl:px-36 2xl:px-64">
          <Link href="/feed" className="flex items-center">
            <Icons.logo />
            <Badge className="ml-2 md:ml-3 px-1 py-0" variant={"secondary"}>Beta</Badge>
          </Link>
  
          <div className="flex items-center gap-2 md:gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button key={"New Post"} variant={"ghost"} size={"icon"} asChild>
                          <Link href={"/editor"}><Plus className="h-[1.2rem] w-[1.2rem]" /></Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        New Post
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <SearchBar />
                      </TooltipTrigger>
                      <TooltipContent>
                        Search
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Notifications notifications={notifications} />
                      </TooltipTrigger>
                      <TooltipContent>
                        Notifications
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                
                <ModeToggle />
                  <UserNav />
  
              </div>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="menu">
        <div className="menu-backdrop h-[60px] border-b w-full">
        </div>
        <div className="menu-container p-3 xl:px-36 2xl:px-64">
          <Link href="/" className="font-bold">
            <Icons.logo />
          </Link>
          <div className="flex items-center gap-4">
                <ModeToggle />
              <Button onClick={() => signIn("github")}>
                  Join
              </Button>
              </div>
        </div>
      </nav>)
  }
}

export default Navbar;