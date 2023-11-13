"use client"

import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar/navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession();
  return (
    <div className='min-h-screen'>
      <>
            <Navbar />
            {children}
          </>
    </div>
  )
}
