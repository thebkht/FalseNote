import PopularPosts from '@/components/feed/popular-posts';
import FeaturedDev from '@/components/feed/featured/featured-dev';
import { fetchFeed } from '@/components/feed/get-feed';
import InfinitiveScrollFeed from '@/components/feed/feed';
import { fetchUsers } from '@/components/feed/fetch-user';
import Link from 'next/link';
import TagBadge from '@/components/tags/tag';
import { fetchTags } from '@/components/feed/get-tags';
import { getServerSideProps, getSessionUser } from '@/components/get-session-user';
import FeedTabs from '@/components/feed/navbar/navbar';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { fetchFollowingTags } from '@/components/get-following-tags';

export default async function Feed({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {

  const tag = typeof searchParams.tag === 'string' ? searchParams.tag : undefined
  const feed = await fetchFeed({ page: 0, tag });
  const session = await getSessionUser();
  
  const topData = await fetchUsers({id: session?.id})
  const topUsers = topData?.topUsers;
  const tagsData = await fetchTags();
  const popularTags = tagsData?.tags;

  tag ? revalidatePath('/feed?tag='+tag) : revalidatePath('/feed');
  /* if(session === null ) {
    return redirect('/')
  } */

  const userFollowings = await fetchFollowingTags({id: session?.id})
  console.log(await getServerSideProps())

  return (
    <>
      <main className="flex flex-col items-center justify-between feed xl:px-8">
        <div className="md:flex lg:flex-nowrap flex-wrap md:mx-[-16px] w-full xl:gap-8 md:gap-4">
          <div className="md:my-4 w-full lg:w-2/3">
            <FeedTabs tabs={userFollowings} activeTab={tag} />
              <div className="pt-10">
              {!feed || feed.length === 0 ? (
                <div className="w-full max-h-screen my-auto flex justify-center items-center bg-background">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <h1 className="text-2xl font-bold">No posts yet</h1>
                  <p className="text-muted-foreground">When you follow someone, their posts will show up here.</p>
                </div>
              </div>
              ) : (
                <InfinitiveScrollFeed initialFeed={feed} tag={tag} />
              )}
              </div>
            </div>
          <div className="hidden lg:block md:my-4 lg:w-1/3 xl:pl-8 md:pl-4 border-l min-h-[calc(100vh - 10rem)]" style={
            {
              minHeight: "calc(100vh - 5rem)"
            }
          }>
            <div className="relative w-full h-full inline-block">
            <div className="sticky space-y-6 top-[70px]">
            <PopularPosts />
            <div className="tags">
            <h2 className="mb-2 font-semibold">Popular tags</h2>
                    <div className="w-2/3 md:w-1/4 lg:w-full flex-wrap">
                         {popularTags?.map((tag: any) => (
                              <Link href={`/tags/${tag.name}`} key={tag.id}>
                                   <TagBadge className="my-1 mr-1" variant={"secondary"}>{tag.name}</TagBadge>
                              </Link>
                         ))}
                    </div>
            </div>
            {topUsers && (
              <FeaturedDev data={topUsers} />
            )}
            </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}