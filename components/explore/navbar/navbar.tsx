'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { items } from "./items"
import Link from "next/link";
import { use } from "react";
import { usePathname } from "next/navigation";

type Item = {
     label: string;
     icon: React.ElementType;
     path: string;
};


export default function ExploreTabs() {
     const path = usePathname();
     // check path tills the next / is contains from items and set default value for example /feed leave it /feed if /feed/1 set /feed
     let pathname = ''
     if(path.split("/").slice(0, 2).join("/")){
          pathname = path.split("/").slice(0, 2).join("/")
     }
     console.log(pathname);
     return (
          <div className="w-full bg-background/70 backdrop-blur-md absolute top-[60px] p-1.5 flex justify-center z-[10]">
               <Tabs defaultValue={pathname} className="">
                    <TabsList className="bg-transparent gap-2">
                         {items.map((item: any) => (
                              <Link href={item.path} key={item.path}>
                                   <TabsTrigger value={item.path} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                        <item.icon className="h-4 w-4 mr-2" />
                                        {item.label}
                                   </TabsTrigger>
                              </Link>
                         ))}
                    </TabsList>
               </Tabs>
          </div>
     );
}