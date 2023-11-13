import ExploreTabs from "@/components/explore/navbar/navbar";
import { SiteFooter } from "@/components/footer";
import { Metadata } from "next"

export const metadata: Metadata = {
     title: 'Explore topics on FalseNotes',
     description: 'Explore topics on FalseNotes',
}


export default function TagsLayout({ children }: { children: React.ReactNode }) {

     return (
          <>
               <div className="md:container mx-auto px-4 pt-5">
                    {children}
               </div>
               <SiteFooter className="!px-3.5" />
          </>

     )
}