import ExploreTabs from "@/components/explore/navbar/navbar"
import { SiteFooter } from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
     title: 'Explore - FalseNotes',
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
      <SiteFooter className="px-3.5" />
     </>
  )
}
