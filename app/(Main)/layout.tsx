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
      <div className='h-screen w-full overflow-y-scroll'>
        <div className="md:container mx-auto px-4 pt-16">
          {children}
        </div>
      </div>
    </>
  )
}
