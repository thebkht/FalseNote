import ExploreTabs from "@/components/explore/navbar/navbar";
import { Metadata } from "next"

export const metadata: Metadata = {
     title: 'Explore topics | FalseNotes',
     description: 'Explore topics on FalseNotes',
}


export default function TagsLayout({ children }: { children: React.ReactNode }) {

     return (
          <div className="md:container mx-auto px-4 pt-5">
          {children}
        </div>
          
     )
}