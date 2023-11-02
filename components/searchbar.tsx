import { Hash, Search } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// This is a placeholder function. Replace it with your actual implementation.
async function fetchSuggestions(query: string) {
  const [userResponse, tagResponse] = await Promise.all([
    fetch(`/api/users?query=${encodeURIComponent(query)}&limit=3`),
    fetch(`/api/tags?query=${encodeURIComponent(query)}&limit=3`),
  ]);

  if (!userResponse.ok) {
    throw new Error(`User API request failed: ${userResponse.status}`);
  }
  if (!tagResponse.ok) {
    throw new Error(`Tag API request failed: ${tagResponse.status}`);
  }

  const users = await userResponse.json();
  const tags = await tagResponse.json();

  return { users, tags };
}

export default function SearchBar() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const initialRender = useRef(true)
   
  const [text, setText] = useState(null)
  const [query] = useDebounce(text, 750)
  const [suggestions, setSuggestions] = useState<any>([])

  useEffect(() => {
    if (query) {
      fetchSuggestions(query).then((result) => setSuggestions(result));
    } else {
      setSuggestions({ users: [], tags: [] });
    }
  }, [query]);

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
          {
            suggestions.length === 0 && (
              <CommandEmpty>
                <p>No results found</p>
              </CommandEmpty>
            )
          }
          {
            //users
            suggestions?.users?.length > 0 && (
              <CommandGroup title="Users">
                {suggestions.users.map((user: any) => (
                  <CommandItem
                    key={user.id}
                    onClick={() => {
                      router.push(`/${user.username}`)
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username}</AvatarFallback>
                    </Avatar>
                    <span>{user.name || user.username}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}{suggestions?.users?.length > 0 && suggestions?.tags?.length > 0 && <CommandSeparator />}{
            //tags
            suggestions?.tags?.length > 0 && (
              <CommandGroup title="Tags">
                {suggestions.tags.map((tag: any) => (
                  <CommandItem
                    key={tag.id}
                    onClick={() => {
                      router.push(`/tags/${tag.name}`)
                    }}
                  >
                    <Hash className="mr-2 h-4 w-4" />
                    <span>{tag.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )            
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}