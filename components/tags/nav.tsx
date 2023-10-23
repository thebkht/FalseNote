"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

export function TagNav({ className, items, ...props }: { className?: string, items: any, props?: any }) {
  const pathname = usePathname()
  return (
    <nav
      className={cn(
        "flex justify-center items-center",
        className
      )}
      {...props}
    >
      <ScrollArea className="w-full">
      <div className="flex gap-2 pb-3">
      {items.map((item: any) => (
        <Button
          key={item.id}
          variant={pathname === item.href ? "secondary" : "outline"}
          asChild
          >
          <Link href={item.href} className="capitalize">
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