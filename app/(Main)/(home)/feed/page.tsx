import PopularPosts from '@/components/feed/popular-posts';
import FeaturedDev from '@/components/feed/featured/featured-dev';
import { fetchFeed } from '@/components/feed/get-feed';
import InfinitiveScrollFeed from '@/components/feed/feed';
import { fetchUsers } from '@/components/feed/fetch-user';
import Link from 'next/link';
import TagBadge from '@/components/tags/tag';
import { fetchTags } from '@/components/feed/get-tags';
import { getSessionUser } from '@/components/get-session-user';
import FeedTabs from '@/components/feed/navbar/navbar';
import { redirect } from 'next/navigation';
import { fetchFollowingTags } from '@/components/get-following-tags';
import { getSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBookmarks, getFollowings } from '@/lib/prisma/session';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dateFormat } from '@/lib/format-date';
import { Icons } from '@/components/icon';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { SiteFooter } from '@/components/footer';

export default async function Feed({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getSessionUser();
  const userFollowingsTags = await fetchFollowingTags({ id: session?.id })

  if (session) {
    if(userFollowingsTags.length === 0) {
      redirect('/get-started')
    } 
  } else {
    return redirect('/')
  }

  const tab = typeof searchParams.tab === 'string' ? searchParams.tab : undefined
  const feed = await fetchFeed({ page: 0, tab, limit: 10 });

  const topData = await fetchUsers({ id: session?.id })
  const topUsers = topData?.users;
  const popularTags = await fetchTags();

  const { bookmarks, bookmarksCount } = await getBookmarks({ id: session?.id, limit: 3 })

  return (
    <>
      <FeedTabs tabs={userFollowingsTags} activeTab={tab} />
            <div className="pt-10">
            <InfinitiveScrollFeed initialFeed={feed} tag={tab} session={session} />
            </div>
    </>
  )
}