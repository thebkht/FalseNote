import type { Metadata } from 'next'
import Navbar from '@/components/navbar/navbar'
import { ScrollArea } from '@/components/ui/scroll-area'

export const metadata: Metadata = {
  title: 'FalseNotes',
  description: '🚀 FalseNotes is a developer-focused blogging platform where individual developers can ignite discussions, share expertise, and craft their coding journeys.',
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
     <Navbar />
            <ScrollArea className='h-screen max-w-screen xl:px-36 2xl:px-64'>
              <div className='py-24 px-4 lg:px-8 md:px-6'>
                {children}
              </div>
            </ScrollArea>
    </>
  )
}
