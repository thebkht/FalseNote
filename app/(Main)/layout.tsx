"use client"

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
            <div className='h-screen w-full xl:px-36 2xl:px-64 overflow-y-scroll'>
              <div className='pt-14 px-4 lg:px-8 md:px-6 w-full'>
                {children}
              </div>
            </div>
     </>
  )
}
