"use client"

import { Button } from "@/components/ui/button";
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
import { PostCreateButton } from "./post-create-button";

function Navbar() {
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (status !== "loading") {
      setIsLoaded(true);
    }
  }, [status]);

  /* useEffect(() => {
    async function getNotifications(){
      const sessionUser = await getSessionUser();
      try {
        const notificationsData = await fetch(`/api/notifications?user_id=${sessionUser.userid}`, {
          method: "GET",
        });
        const not = await notificationsData.json();
        setNotifications(not.data);
      } catch (error) {
        console.error(error);
      }
    }
    getNotifications();
      }, [session]) */

  if (isLoaded) {
    return (
      <div className="menu-container h-[60px] px-3.5 fixed md:sticky top-0 backdrop-blur-md">
          <Link href="/feed?tab=following" className="flex items-center">
            <Icons.logo />
            <Badge className="ml-2 md:ml-3 px-1 py-0" variant={"secondary"}>Beta</Badge>
          </Link>
  
          <div className="flex items-center gap-2 md:gap-4">
            <SearchBar />
          <PostCreateButton key={"New Post"} variant="ghost" size={"icon"} />
                  
                  {/* <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Notifications notifications={notifications} />
                      </TooltipTrigger>
                      <TooltipContent>
                        Notifications
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider> */}
                
                <ModeToggle />
                  <UserNav />
  
              </div>
        </div>
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