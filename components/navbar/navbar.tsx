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
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

function Navbar() {
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

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

  return (
    <div className="menu-container h-[60px] px-3.5 sticky top-0 bg-background border-b">
      <Link href={ session ? "/feed" : "/" } className="flex items-center">
        <Icons.logo className="" />
        <Badge className="ml-2 md:ml-3 px-1 py-0" variant={"secondary"}>Beta</Badge>
      </Link>

      <div className="flex items-center gap-1 md:gap-4">
        <Button variant="ghost" size={"icon"} className="flex md:hidden" asChild>
          <Link href="/explore">
            <MagnifyingGlassIcon className="md:h-[1.2rem] md:w-[1.2rem]" />
            <span className="sr-only">Search</span>
          </Link>
        </Button>
        <SearchBar />
        {
          session ? (
            <>
              <PostCreateButton key={"New Post"} variant="ghost" size={"icon"} />
              <UserNav />
            </>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <Button asChild>
                <Link href={"/signin"}>Join</Link>
              </Button>
            </div>
          )
        }

      </div>
    </div>
  );
}

export default Navbar;