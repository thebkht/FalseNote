import { Metadata } from "next"

export const metadata: Metadata = {
     title: 'Notifications - FalseNotes',
}

export default function NotificationLayout({
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
