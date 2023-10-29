import { Icons } from '@/components/icon';
import PopularPosts from '@/components/feed/popular-posts';
import FeaturedDev from '@/components/feed/featured/featured-dev';
import UserExplore from '@/components/explore/user/details';
import ExploreTabs from '@/components/explore/navbar/navbar';
import { fetchFeed } from '@/components/feed/get-feed';
import InfinitiveScrollFeed from '@/components/feed/feed';
import { fetchUsers } from '@/components/feed/fetch-user';

export default async function Feed() {
  const feedData = await fetchFeed({ page: 0 });
  const feed = feedData?.feed;
  const topData = await fetchUsers()
  const topUsers = topData?.topUsers;

  return (
    <>
      <main className="flex flex-col items-center justify-between feed xl:px-8">
        <ExploreTabs />
        <div className="md:flex lg:flex-nowrap flex-wrap md:mx-[-16px] w-full xl:gap-8 md:gap-4 my-8">
          <div className="md:my-4 w-full lg:w-2/3">
              {!feed || feed.length === 0 ? (
                <div className="w-full max-h-screen my-auto flex justify-center items-center bg-background">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <h1 className="text-2xl font-bold">No posts yet</h1>
                  <p className="text-muted-foreground">When you follow someone, their posts will show up here.</p>
                </div>
              </div>
              ) : (
                <InfinitiveScrollFeed initialFeed={feed} />
              )}
            </div>
          <div className="hidden lg:block md:my-4 lg:w-1/3 space-y-6 xl:px-8 md:px-4 border-l sticky h-full">
            <PopularPosts />
            {topUsers && (
              <FeaturedDev data={topUsers} />
            )}
          </div>
        </div>
      </main>
    </>
  )
}