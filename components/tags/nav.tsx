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

export function TagNav({ className, items, ...props }: { className?: string, items: any, props?: any }) {
  const pathname = usePathname()
  const { status } = useSession()

  if (status !== "authenticated") return null;
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={25}
      navigation
      scrollbar={{ draggable: true }}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      className="w-screen"
    >
      {
        items.map((item: any, index: any) => (
          <SwiperSlide key={item.id}>
            <Button
              variant={pathname === item.href ? "secondary" : "outline"}
              className={pathname !== item.href ? "bg-background" : ""}
              asChild
            >
              <Link href={item.href} className="capitalize">
                {item.name.replace(/-/g, " ")}
              </Link>
            </Button>
          </SwiperSlide>
        ))
      }
    </Swiper>
    // <nav
    //   className={cn(
    //     "flex justify-center items-center",
    //     className
    //   )}
    //   {...props}
    // >
    //   <ScrollArea className="w-full">
    //   <div className="flex gap-2 pb-3 justify-center w-full">
    //   {items.map((item: any) => (
    //     <Button
    //       key={item.id}
    //       variant={pathname === item.href ? "secondary" : "outline"}
    //       className={pathname !== item.href ? "bg-background" : ""}
    //       asChild
    //       >
    //       <Link href={item.href} className="capitalize">
    //         {item.name.replace(/-/g, " ")}
    //       </Link>
    //       </Button>
    //   ))}
    //   </div>
    //   <ScrollBar orientation="horizontal" />
    //       </ScrollArea>
    // </nav>
  )
}