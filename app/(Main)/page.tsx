"use client"
import Landing from '@/components/landing/landing'
import { useSession } from 'next-auth/react'
import Feed from '@/components/feed/feed'
import { use, useEffect } from 'react';
import dynamic from 'next/dynamic';

export default function Home() {
  const { status, update } = useSession();

  const LoadedFeed = dynamic(() => import('@/components/feed/feed'), {
    ssr: false,
  });
  const LoadedLanding = dynamic(() => import('@/components/landing/landing'), {
    ssr: false,
  });

  if (status !== "authenticated") {
    return <LoadedLanding />
  } else {
    return <LoadedFeed />
  }
}
