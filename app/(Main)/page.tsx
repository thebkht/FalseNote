import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic'
import { getFollowings } from '@/lib/prisma/session';
import { fetchFollowingTags } from '@/components/get-following-tags';
import { getSessionUser } from '@/components/get-session-user';
import Landing from '@/components/landing/landing';

export default async function Home() {

  const session = await getSessionUser();

  const { followings } = await getFollowings({ id: session?.id })
  const userFollowingsTags = await fetchFollowingTags({ id: session?.id })
  
  if (session) {
    if(userFollowingsTags.length === 0 && followings.length === 0) {
      redirect('/get-started')
    } else if (userFollowingsTags.length > 0 && followings.length > 0) {
      redirect('/feed?tab=following')
    } 
  }
  
  return <Landing />;
}
