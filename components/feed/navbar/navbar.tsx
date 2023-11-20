'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";
import { Plus } from "lucide-react";
import { useRouter } from 'next/navigation'


export default function FeedTabs({ tabs, activeTab = 'foryou', children }: { tabs: any, activeTab?: string, children?: React.ReactNode }) {
     const [firstTab, inFView] = useInView();
     const [lastTab, inLView] = useInView();
     const router = useRouter()

     return (
          <>

               <div className="bg-background sticky top-[60px] z-10">
                    <div className="w-full h-full absolute insert-0 top-0">
                         <div className={`tab-shadow right-auto left-0 ${inFView && 'opacity-0'}`} style={
                              {
                                   transform: "scaleX(-1)",
                                   left: "-3%"
                              }
                         }></div>
                         <div className={`tab-shadow ${inLView && 'opacity-0'}`} style={{ right: "-3%" }}></div>
                    </div>
                    <div className="inline-flex h-10 items-center justify-center rounded-md bg-background p-1 text-muted-foreground w-full">
                         <ScrollArea className="w-full py-2">
                              <div className="inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground bg-transparent gap-2">
                                   <div ref={firstTab} className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm bg-transparent">
                                        <Link href={`/explore`}><Plus className="h-5 w-5" /></Link>
                                   </div>
                                   <div className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeTab == 'foryou' ? 'bg-secondary-foreground shadow-sm text-secondary' : 'bg-muted'}`} onClick={() => {
                                        router.replace('/feed')
                                   }}>
                                        For You
                                   </div>
                                   <div className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeTab == 'following' ? 'bg-secondary-foreground shadow-sm text-secondary' : 'bg-muted'}`} onClick={() => {
                                        router.replace('/feed?tab=following')
                                   }}>
                                        Following
                                   </div>
                                   {tabs?.map((item: any, index: number) => (

                                        <div className={`inline-flex capitalize items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeTab == item.tag.name ? 'bg-background shadow-sm text-foreground border-foreground border' : 'bg-muted'}`} onClick={() => {
                                             router.replace(`/feed?tab=${item.tag.name}`)
                                        }} key={item.tag.id}>

                                             {item.tag.name.replace(/-/g, " ")}

                                        </div>

                                   ))}
                                   <div ref={lastTab} className="bg-transparent w-3" />
                              </div>
                              <ScrollBar orientation="horizontal" />
                         </ScrollArea>

                         {children}
                    </div>

               </div>
          </>
     );
}