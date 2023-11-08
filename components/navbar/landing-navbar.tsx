"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Icons } from "../icon";


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
        <div className="menu-container sticky p-3.5 backdrop-blur-md">
          <Link href="/" className="flex items-center">
            <Icons.logo />
            <Badge className="ml-2 md:ml-3 px-1 py-0" variant={"secondary"}>Beta</Badge>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
                <ModeToggle />
              <Button asChild>
                  <Link href={"/signin"}>Join</Link>
              </Button>
              </div>
        </div>
      </nav>)
  }
}

export default LandingNavbar;