import { Icons } from '@/components/icon';
import PopularPosts from '@/components/feed/popular-posts';
import FeaturedDev from '@/components/feed/featured/featured-dev';
import UserExplore from '@/components/explore/user/details';
import ExploreTabs from '@/components/explore/navbar/navbar';
import { fetchFeed } from '@/components/feed/get-feed';
import InfinitiveScrollFeed from '@/components/feed/feed';

export default async function Feed() {
  const feedData = await fetchFeed({ page: 0 });
  const feed = feedData?.feed;

  return (
    <>
      <main className="flex flex-col items-center justify-between feed xl:px-8">
        <ExploreTabs />
        <div className="md:flex lg:flex-nowrap flex-wrap md:mx-[-16px] w-full gap-8 my-8">
          <div className="md:my-4 w-full lg:w-3/4 pr-20">
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
          <div className="hidden lg:block md:my-4 md:w-1/4 space-y-6">
            <PopularPosts />
            {/* <FeaturedDev /> */}
          </div>
        </div>
      </main>
    </>
  )
}