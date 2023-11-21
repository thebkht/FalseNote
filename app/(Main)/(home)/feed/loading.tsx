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
import FeedTabsSkeleton from '@/components/feed/navbar/navbar-skeleton';
import PostCardSkeleton from '@/components/skeletons/feed-post-card';
import { Separator } from '@/components/ui/separator';
import PopularPostsSkeleton from '@/components/feed/popular-posts-skeleton';
import TagsCardSkeleton from '@/components/skeletons/tags';
import FeaturedDevSkeleton from '@/components/feed/featured/featured-dev-skeleton';
import BookmarksCardSkeleton from '@/components/skeletons/bookmark-card';

export default async function Loading() {
  return (
    <div className='w-full'>
      <FeedTabsSkeleton />
            <div className="pt-10">
              <div className="feed__list">
                <div className="flex lg:gap-6 md:gap-5 gap-4">
                  <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
                  <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
                  <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
                  <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
                  <PostCardSkeleton className="rounded-lg bg-backgraound max-h-72 w-full" />
                </div>
              </div>
            </div>
    </div>
  )
}
/* <div className="hidden lg:block md:my-4 lg:w-1/3 xl:pl-8 md:pl-4 border-l min-h-screen">
            <div className="relative w-full h-full inline-block">
              <div className="sticky space-y-4 top-16 w-full">
                <PopularPostsSkeleton />
                <TagsCardSkeleton />
                <FeaturedDevSkeleton />
                <BookmarksCardSkeleton />
              </div>
            </div>
          </div>
           */
