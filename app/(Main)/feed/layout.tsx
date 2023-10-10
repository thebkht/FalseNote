import { Metadata } from "next"

export const metadata: Metadata = {
     title: 'Home | FalseNotes',
}

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
     <>
      {children}
     </>
  )
}
