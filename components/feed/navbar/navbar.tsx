'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";


export default function FeedTabs({ tabs, activeTab = 'following', children }: { tabs: any, activeTab?: string, children?: React.ReactNode }) {
     const [firstTab, inFView] = useInView();
     const [lastTab, inLView] = useInView();
     
     return (
          <>
               
          <div className="bg-background sticky top-[60px] z-50">
               <div className="w-full h-full absolute insert-0 top-0">
                         <div className={`tab-shadow right-auto left-0 ${inFView && 'opacity-0'}`} style={
                              {
                                   transform: "scaleX(-1)",
                                   left: "-3%"
                              }
                         }></div>
                         <div className={`tab-shadow ${inLView && 'opacity-0'}`} style={{ right: "-3%" }}></div>
                    </div>
               <Tabs defaultValue={activeTab} className="">
                    <ScrollArea className="w-full py-2">
                    <TabsList className="bg-transparent gap-2">
                    <Link href={`/feed`}>
                                   <TabsTrigger value="following" ref={firstTab} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                        Following
                                   </TabsTrigger>
                              </Link>
                         {tabs?.map((item: any, index: number) => (
                              index === tabs.length - 1 ?
                                   <Link href={`/feed?tag=${item.tag.name}`} key={item.tag.id}><TabsTrigger value={item.tag.name} ref={lastTab} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground capitalize">
                                        
                                        {item.tag.name.replace(/-/g, " ")}
                                        
                                   </TabsTrigger></Link>
                                   :<Link href={`/feed?tag=${item.tag.name}`} key={item.tag.id}>
                                   <TabsTrigger value={item.tag.name} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground capitalize">
                                        
                                        {item.tag.name.replace(/-/g, " ")}
                                        
                                   </TabsTrigger></Link>
                              
                         ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    
                    {children}
               </Tabs>
               
          </div>
          </>
     );
}