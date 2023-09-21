"use client"
import Landing from '@/components/landing/landing'
import { useSession } from 'next-auth/react'
import Feed from '@/components/feed/feed'
import { use, useEffect } from 'react';

export default function Home() {
  const { status, update } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      update();
    }
  }, [status, update]);

  if (status !== "authenticated") {
    return <Landing />
  } else {
    return <Feed />
  }
}
