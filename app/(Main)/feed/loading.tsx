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
    <>
      <main className="flex flex-col items-center justify-between feed xl:px-8">
        <div className="md:flex lg:flex-nowrap flex-wrap md:mx-[-16px] w-full xl:gap-8 md:gap-4">
          <div className="md:my-4 w-full lg:w-2/3">
            <FeedTabsSkeleton />
            <div className="pt-10">
              <div className="feed__list">
                <div className="divide-y">
                  <PostCardSkeleton className="rounded-lg bg-backgreound max-h-72 w-full border-none shadow-none" />
                  <Separator />
                  <PostCardSkeleton className="rounded-lg bg-backgreound max-h-72 w-full border-none shadow-none" />
                  <Separator />
                  <PostCardSkeleton className="rounded-lg bg-backgreound max-h-72 w-full border-none shadow-none" />
                  <Separator />
                  <PostCardSkeleton className="rounded-lg bg-backgreound max-h-72 w-full border-none shadow-none" />
                  <Separator />
                  <PostCardSkeleton className="rounded-lg bg-backgreound max-h-72 w-full border-none shadow-none" />
                  <Separator />
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block md:my-4 lg:w-1/3 xl:pl-8 md:pl-4 border-l min-h-screen">
            <div className="relative w-full h-full inline-block">
              <div className="sticky space-y-4 top-16">
                <PopularPostsSkeleton />
                <TagsCardSkeleton />
                <FeaturedDevSkeleton />
                <BookmarksCardSkeleton />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}