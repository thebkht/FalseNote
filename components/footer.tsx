import * as React from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icon"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
     return (
          <footer className={cn("container border-t flex flex-col items-center justify-between gap-4 py-6 md:h-24 md:flex-row md:py-0 text-sm", className)}>
               <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0 flex-auto">
                    <Icons.logoIcon />
                    <p className="text-center text-inherit leading-loose md:text-left">
                         Built by{" "}
                         <a
                              href={siteConfig.links.authorTwitter}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium underline underline-offset-4"
                         >
                              yusupovbg
                         </a>
                         . The source code is available on{" "}
                         <a
                              href={siteConfig.links.github}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium underline underline-offset-4"
                         >
                              GitHub
                         </a>
                         .
                    </p>
               </div>
               <div className="">
               <ModeToggle />
               </div>
          </footer>
     )
}