"use client"

import { Button } from "@/components/ui/button";
import { items } from "./items";
import Link from "next/link";
import { MenuIcon, Plus, SearchIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "./user-nav";
import { Icons } from "@/components/icon";
import { signIn, useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { use, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import SearchBar from "../searchbar";


function Navbar() {
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const user = session?.user;
  useEffect(() => {
    if (status !== "loading") {
      setIsLoaded(true);
    }
  }, [status]);
  
  if (isLoaded) {
    return (
      <nav className="menu">
        <div className="menu-backdrop h-[60px] border-b w-screen md:w-full">
        </div>
        <div className="menu-container p-2 xl:px-36 2xl:px-64">
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
                        <p>New Post</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                <SearchBar />
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