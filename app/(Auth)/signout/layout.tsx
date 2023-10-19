import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ScrollArea } from '@/components/ui/scroll-area'

export const metadata: Metadata = {
  title: 'Sign Out? | FalseNotes',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
     <ScrollArea className='h-screen min-h-full max-w-screen'>
            {children}
            </ScrollArea>
    </>
  )
}
