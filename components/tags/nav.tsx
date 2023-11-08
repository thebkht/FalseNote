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

export function TagNav({ className, items, ...props }: { className?: string, items: any, props?: any }) {
  const path = usePathname()
  const { status } = useSession()
  // path /tags/[tagname]
  const pathname = path.split("/")[2]
  const [tags, setTags] = React.useState(items)

  React.useEffect(() => {
    setTags(items)
  }, [items])

  if (status == "loading") return null;
  return (
    <nav
      className={cn(
        "flex justify-center items-center",
        className
      )}
      {...props}
    >
      <ScrollArea className="w-full">
      <div className="flex gap-2 pb-3 justify-center w-full">
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
      </div>
      <ScrollBar orientation="horizontal" />
          </ScrollArea>
    </nav>
    
  )
}