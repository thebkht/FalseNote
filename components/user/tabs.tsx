import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";

export default function UserTab({ user, session, defaultValue, ...props }: { user: any, session: any } & React.ComponentPropsWithoutRef<typeof Tabs>) {
     return (
          <div>
               <Tabs {...props} className="" defaultValue={defaultValue || "posts"}>
                    <TabsList className="bg-transparent gap-2">
                         <Link href={`${user.username}/`}>
                              <TabsTrigger value="posts" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   Posts
                              </TabsTrigger>
                         </Link>
                         <Link href={`${user.username}/?tab=bookmarks`}>
                              <TabsTrigger value="bookmarks" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   Bookmarks
                              </TabsTrigger>
                         </Link>
                    </TabsList>
               </Tabs>

          </div>
     )
}