import { Button } from "@/components/ui/button";
import { items } from "./items";
import Link from "next/link";
import { MenuIcon, SearchIcon } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { UserNav } from "./user-nav";
/* import { Icons } from "../icons";
import { ModeToggle } from "../mode-toggle";
import { MobileNav } from "./mobile-nav"; */

function Navbar() {
  return (
    <nav className="fixed w-full z-[40] flex menu-backdrop items-center justify-between bg-background p-3 border-b xl:px-36 2xl:px-64">
      <Link href="/" className="font-bold">
        {/* <Icons.logo /> */} FalseNotes
      </Link>

      <div className="hidden lg:flex items-center gap-16">
        
      </div>
      <div className="flex items-center gap-4">
      {items.map((item) => (
          <Button key={item.title} variant={"ghost"} size={"icon"} asChild>
            <Link href={item.url}><item.icon className="h-[1.2rem] w-[1.2rem]" /></Link>
          </Button>
        ))}
        <ModeToggle />
        <UserNav />
        {/* <Button asChild>
          <Link href={"/signin"}>Login</Link>
        </Button> */}
      </div>
      {/* <MobileNav /> */}
    </nav>
  );
}

export default Navbar;