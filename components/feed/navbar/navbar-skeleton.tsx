'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton";


export default function FeedTabsSkeleton() {

     return (
          <>

               <div className="bg-background sticky top-[60px] z-10">
                    <Tabs defaultValue={''} className="">
                         <TabsList className="bg-transparent gap-2">
                              <TabsTrigger value="foryou" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   <Skeleton className="h-5 w-10" />
                              </TabsTrigger>
                         </TabsList>
                         <TabsList className="bg-transparent gap-2">
                              <TabsTrigger value="foryou" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   <Skeleton className="h-5 w-10" />
                              </TabsTrigger>
                         </TabsList>
                         <TabsList className="bg-transparent gap-2">
                              <TabsTrigger value="foryou" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   <Skeleton className="h-5 w-10" />
                              </TabsTrigger>
                         </TabsList>
                         <TabsList className="bg-transparent gap-2">
                              <TabsTrigger value="foryou" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   <Skeleton className="h-5 w-10" />
                              </TabsTrigger>
                         </TabsList>
                         <TabsList className="bg-transparent gap-2">
                              <TabsTrigger value="foryou" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   <Skeleton className="h-5 w-10" />
                              </TabsTrigger>
                         </TabsList>
                         <TabsList className="bg-transparent gap-2">
                              <TabsTrigger value="foryou" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   <Skeleton className="h-5 w-10" />
                              </TabsTrigger>
                         </TabsList>
                    </Tabs>

               </div>
          </>
     );
}