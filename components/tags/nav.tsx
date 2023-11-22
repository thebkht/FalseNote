"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Swiper, SwiperSlide } from 'swiper/react';
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { useSession } from "next-auth/react"
import 'swiper/css';
import 'swiper/css/virtual';
import React from "react";
import { Compass } from "lucide-react";
import { useInView } from "react-intersection-observer";

export function TagNav({ className, items, tag, ...props }: { className?: string, items?: any, tag?: any } & React.ComponentPropsWithoutRef<"nav">) {
  const path = usePathname()
  const { status } = useSession()
  const pathname = path.split("/")[2]
  const [tags, setTags] = React.useState(items)

  React.useEffect(() => {
    setTags(items)
  }, [items])
  const [firstTab, inFView] = useInView();
     const [lastTab, inLView] = useInView();

  if (status == "loading") return null;
  return (
    <nav
      className={cn(
        "flex justify-center items-center",
        className
      )}
      {...props}
    >
      <Button variant={"outline"} className={"bg-background"} size={'lg'} asChild>
        <Link href={'/tags'} className="capitalize">
          <Compass className="h-4 w-4 mr-2" />
          Explore Tags
        </Link>
      </Button>
      {/* <ScrollArea className="w-full">
      <div className="flex gap-2 pb-3 justify-center w-full">
      <Button
          key={tag.id}
          variant={"outline"}
          className={"bg-background"}
          asChild
          >
          <Link href={'/tags'} className="capitalize">
          <Compass className="h-4 w-4 mr-2" />
                                        Explore
          </Link>
          </Button>
      <Button
          key={tag.id}
          variant={pathname === tag.name ? "secondary" : "outline"}
          className={pathname !== tag.name ? "bg-background" : ""}
          asChild
          >
          <Link href={tag.name} className="capitalize">
            {tag.name.replace(/-/g, " ")}
          </Link>
          </Button>
      {items.map((item: any) => (
        <Button
          key={item.id}
          variant={pathname === item.name ? "secondary" : "outline"}
          className={pathname !== item.name ? "bg-background" : ""}
          asChild
          >
          <Link href={item.name} className="capitalize">
            {item.name.replace(/-/g, " ")}
          </Link>
          </Button>
      ))}
      <div ref={lastTab} className="bg-transparent w-3 px-3 py-1.5 text-sm " />
      </div>
      <ScrollBar orientation="horizontal" />
          </ScrollArea> */}
    </nav>
    
  )
}