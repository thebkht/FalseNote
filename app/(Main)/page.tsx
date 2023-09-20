"use client"
import Landing from '@/components/landing/landing'
import { useSession } from 'next-auth/react'
import Feed from '@/components/feed/feed'
import { useEffect } from 'react';

export default function Home() {
  const { status } = useSession();

  if (status !== "authenticated") {
    return <Landing />
  } else {
    return <Feed />
  }
}
