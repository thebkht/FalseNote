import { Metadata } from "next"

export const metadata: Metadata = {
     title: 'Home - FalseNotes',
}

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
     <>
      <div className="md:container mx-auto px-4">
          {children}
        </div>
     </>
  )
}
