import ExploreTabs from "@/components/explore/navbar/navbar";
import { Metadata } from "next"

export const metadata: Metadata = {
     title: 'Explore topics | FalseNotes',
}


export default function TagsLayout({ children }: { children: React.ReactNode }) {

     return (
          <main className="flex flex-col items-center justify-between  pt-5">
               <ExploreTabs />
               {children}
          </main>
     )
}