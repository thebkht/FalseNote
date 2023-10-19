import { Search } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import React from "react";
import { Button } from "./ui/button";



export default function SearchBar() {
  const [open, setOpen] = React.useState(false)
 
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
 
  return (
    <>
      <Button variant={"ghost"} size={"icon"} onClick={() => setOpen((open) => !open)} ><Search className="h-[1.2rem] w-[1.2rem]"/></Button>
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for people or tags..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </CommandDialog>
    </>
  )
}