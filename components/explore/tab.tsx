'use client'
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useState } from "react";

export default function ExploreTab({ activeTab = 'top', search }: { activeTab?: string, search?: string}) {
     const [tab, setTab] = useState<string>(activeTab)
     useEffect(() => {
          setTab(activeTab)
     }, [activeTab])

     return (
          <>
               <Tabs defaultValue={tab} className="my-6 space-y-8">
                         <TabsList className="bg-transparent gap-2 justify-center w-full">
                              <TabsTrigger value={'top'} className="bg-muted data-[state=active]:bg-secondary-foreground data-[state=active]shadow-sm data-[state=active]:text-secondary" asChild>
                                   <Link href={`/explore${search !== undefined ? `?search=${search}` : ''}`}>
                                   Trending
                                   </Link>
                              </TabsTrigger>
                              <TabsTrigger value={'posts'} className="bg-muted data-[state=active]:bg-secondary-foreground data-[state=active]shadow-sm data-[state=active]:text-secondary" asChild>
                                   <Link href={`/explore?tab=posts${search !== undefined ? `&search=${search}` : ''}`}>
                                   Posts
                                   </Link>
                              </TabsTrigger>
                              <TabsTrigger value={'users'} className="bg-muted data-[state=active]:bg-secondary-foreground data-[state=active]shadow-sm data-[state=active]:text-secondary" asChild>
                                   <Link href={`/explore?tab=users${search !== undefined ? `&search=${search}` : ''}`}>
                                   Users
                                   </Link>
                              </TabsTrigger>
                              <TabsTrigger value={'tags'} className="bg-muted data-[state=active]:bg-secondary-foreground data-[state=active]shadow-sm data-[state=active]:text-secondary" asChild>
                                   <Link href={`/explore?tab=tags${search !== undefined ? `&search=${search}` : ''}`}>
                                   Tags
                                   </Link>
                              </TabsTrigger>
                         </TabsList>
                    </Tabs>
          </>
     )
}