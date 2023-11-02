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
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";



export default function SearchBar() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
     const initialRender = useRef(true)
   
     const [text, setText] = useState(null)
     const [query] = useDebounce(text, 750)
   
     useEffect(() => {
       if (initialRender.current) {
         initialRender.current = false
         return
       }
   
       if (!query) {
         router.push(`/explore`)
       } else {
         router.push(`/explore?search=${query}`)
       }
     }, [query])
 
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
      <CommandInput placeholder="Search for people or tags..." onSubmit={(event: FormEvent<HTMLInputElement>) => { event.preventDefault(); router.push(`/explore?search=${text}`); }} onValueChange={setText} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </CommandDialog>
    </>
  )
}