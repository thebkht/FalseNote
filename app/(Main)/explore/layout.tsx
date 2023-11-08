import ExploreTabs from "@/components/explore/navbar/navbar"
import { Metadata } from "next"

export const metadata: Metadata = {
     title: 'Explore | FalseNotes',
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
     <>
     <div className="md:container mx-auto px-4 pt-5">
          <main className="flex flex-col items-center justify-between">
               {children}
          </main>
        </div>
      
     </>
  )
}
