import { Button } from "@/components/ui/button";
import { items } from "./items";
import Link from "next/link";
import { MenuIcon, SearchIcon } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
/* import { Icons } from "../icons";
import { ModeToggle } from "../mode-toggle";
import { MobileNav } from "./mobile-nav"; */

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-background p-6 border-b xl:px-36 2xl:px-64">
      <Link href="/">
        {/* <Icons.logo /> */} FalseNotes
      </Link>

      <div className="hidden lg:flex items-center gap-16">
        {items.map((item) => (
          <Button key={item.title} variant={"ghost"} size={"icon"} asChild>
            <Link href={item.url}><item.icon /></Link>
          </Button>
        ))}
      </div>
      <div className="hidden lg:flex items-center gap-4">
        <ModeToggle />
        <Button variant={"ghost"} size={"icon"}>
          <SearchIcon />
        </Button>
        <Button asChild>
          <Link href={"/signin"}>Login</Link>
        </Button>
      </div>
      {/* <MobileNav /> */}
    </nav>
  );
}

export default Navbar;