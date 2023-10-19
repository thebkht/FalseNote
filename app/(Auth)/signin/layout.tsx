import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ScrollArea } from '@/components/ui/scroll-area'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sign In | FalseNotes',
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
