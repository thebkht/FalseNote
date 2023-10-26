import { Icons } from '@/components/icon';
import PopularPosts from '@/components/feed/popular-posts';
import FeaturedDev from '@/components/feed/featured/featured-dev';
import UserExplore from '@/components/explore/user/details';
import ExploreTabs from '@/components/explore/navbar/navbar';
import { fetchFeed } from '@/components/feed/get-feed';
import InfinitiveScrollFeed from '@/components/feed/feed';

export default async function Feed() {
  const feed = await fetchFeed({ page: 0 });

  return (
    <>
      <main className="flex flex-col items-center justify-between feed ">
        <ExploreTabs />
        <div className="md:flex lg:flex-nowrap flex-wrap md:mx-[-16px] w-full gap-8 my-8">
          <UserExplore className='md:w-full lg:w-1/3 pt-4 lg:pt-0 md:my-4 h-fit' />
          <div className="md:my-4 md:w-[12.5%] lg:w-2/3">
              {!feed ? (
                <div className="feed__list_loadmore my-8 h-max">
                  <Icons.spinner className="h-10 animate-spin mr-2" /> Loading...
                </div>
              ) : (
                <InfinitiveScrollFeed initialFeed={feed} />
              )}
            </div>
          <div className="md:my-4 md:w-1/4 lg:w-1/3 space-y-6">
            <PopularPosts />
            {/* <FeaturedDev data={topUsers} isloaded={!fetching} /> */}
          </div>
        </div>
      </main>
    </>
  )
}