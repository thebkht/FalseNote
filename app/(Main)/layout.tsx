"use client"

import LandingNavbar from '@/components/navbar/landing-navbar'
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar/navbar';
import { SiteFooter } from '@/components/footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession();
  return (
    <div className='min-h-screen'>
      {
        status != 'authenticated' ? (
          <>
            <LandingNavbar />
            {children}
            <SiteFooter className='px-6 xl:px-36 2xl:px-64' />
          </>
        ) : (
          <>
            <Navbar />
            {children}
          </>
        )
      }
    </div>
  )
}
