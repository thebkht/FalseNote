"use client"
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic'

export default function Home() {
  const { status } = useSession();

  const LoadedLanding = dynamic(() => import('@/components/landing/landing'), {
    ssr: false,
  });

  if (status !== 'unauthenticated') {
    redirect('/feed');
  }
  return <LoadedLanding />;
}
