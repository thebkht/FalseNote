"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import LandingNavbar from '@/components/navbar/landing-navbar'
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar/navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession();
  return (
     <>
      {
        status != 'authenticated' ? <LandingNavbar /> : <Navbar />
     }
            <ScrollArea className='h-screen w-screen xl:px-36 2xl:px-64'>
              <div className='py-24 px-4 lg:px-8 md:px-6 w-screen md:w-full'>
                {children}
              </div>
            </ScrollArea>
     </>
  )
}
