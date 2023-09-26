"use client"

import { Button } from "@/components/ui/button";
import { items } from "./items";
import Link from "next/link";
import { MenuIcon, SearchIcon } from "lucide-react";
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


function LandingNavbar() {
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
        <div className="menu-container p-3 xl:px-36 2xl:px-64">
          <Link href="/" className="flex items-center">
            <Icons.logo />
            <Badge className="ml-2 md:ml-3 px-1 py-0">Beta</Badge>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
                <ModeToggle />
              <Button onClick={() => signIn("github")}>
                  Join
              </Button>
              </div>
        </div>
      </nav>)
  }
}

export default LandingNavbar;