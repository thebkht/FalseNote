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
      <div className='mt-16 md:mt-0'>
      {children}
      </div>
    </>
  )
}
