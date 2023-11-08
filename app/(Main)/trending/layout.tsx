import ExploreTabs from "@/components/explore/navbar/navbar";
import { Metadata } from "next"

export const metadata: Metadata = {
     title: 'Trending posts | FalseNotes',
     description: 'There are hot developers and posts',
}


export default function TrendingLayout({ children }: { children: React.ReactNode }) {

     return (
          <div className="md:container mx-auto px-4 pt-16">
          <main className="flex flex-col items-center justify-between  pt-5">
               <ExploreTabs />
               {children}
          </main>
        </div>
          
     )
}