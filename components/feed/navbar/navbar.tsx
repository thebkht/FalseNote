'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { items } from "./items"
import Link from "next/link";
import { use } from "react";
import { usePathname } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Item = {
     label: string;
     icon: React.ElementType;
     path: string;
};


export default function FeedTabs({ tabs, activeTab = 'following', children }: { tabs: any, activeTab?: string, children?: React.ReactNode }) {
     return (
          <div className="bg-background sticky top-[70px]">
               <Tabs defaultValue={activeTab} className="">
                    <ScrollArea className="w-full py-2">
                    <TabsList className="bg-transparent gap-2">
                    <Link href={`/feed`}>
                                   <TabsTrigger value="following" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                        Following
                                   </TabsTrigger>
                              </Link>
                         {tabs?.map((item: any) => (
                              
                                   <TabsTrigger value={item.tag.name}  className="bg-muted data-[state=active]:border data-[state=active]:border-foreground capitalize" key={item.tag.id}>
                                        <Link href={`/feed?tag=${item.tag.name}`}>
                                        {item.tag.name.replace(/-/g, " ")}
                                        </Link>
                                   </TabsTrigger>
                              
                         ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    {children}
               </Tabs>
          </div>
     );
}