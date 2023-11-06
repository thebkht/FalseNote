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
import { fetchForYou } from '@/components/feed/get-foryou';
import { getBookmarks } from '@/lib/prisma/session';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dateFormat } from '@/lib/format-date';
import { Icons } from '@/components/icon';
import { EmptyPlaceholder } from '@/components/empty-placeholder';

export default async function Feed({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {

  const tag = typeof searchParams.tag === 'string' ? searchParams.tag : undefined
  const feed = await fetchFeed({ page: 0, tag });
  const session = await getSessionUser();

  const topData = await fetchUsers({ id: session?.id })
  const topUsers = topData?.topUsers;
  const popularTags = await fetchTags();

  console.log(topData)
  if (!session) {
    return redirect('/')
  }

  const userFollowings = await fetchFollowingTags({ id: session?.id })

  const { bookmarks, bookmarksCount } = await getBookmarks({ id: session?.id })

  const recommendedPosts = await fetchForYou({ page: 0 })

  return (
    <>
      <main className="flex flex-col items-center justify-between feed xl:px-8">
        <div className="md:flex lg:flex-nowrap flex-wrap md:mx-[-16px] w-full xl:gap-8 md:gap-4">
          <div className="md:my-4 w-full lg:w-2/3">
            {userFollowings.length !== 0 && <FeedTabs tabs={userFollowings} activeTab={tag} />}
            <div className="pt-10">
              {!feed || feed.length === 0 ? (
                <div className="w-full max-h-screen my-auto flex justify-center items-center bg-background">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <h1 className="text-2xl font-bold">No posts yet</h1>
                    <p className="text-muted-foreground">When you follow someone, their posts will show up here.</p>
                  </div>
                </div>
              ) : (
                <InfinitiveScrollFeed initialFeed={feed} tag={tag} session={session} />
              )}
            </div>
          </div>
          <div className="hidden lg:block md:my-4 lg:w-1/3 xl:pl-8 md:pl-4 border-l min-h-[calc(100vh - 10rem)]" style={
            {
              minHeight: "calc(100vh - 5rem)"
            }
          }>
            <div className="relative w-full h-full inline-block">
              <div className="sticky space-y-4 top-[70px]">
                <PopularPosts />
                {popularTags.length !== 0 && (
                  <Card className="feed__content_featured_card bg-background border-none shadow-none">
                    <CardHeader className="py-4 px-0">
                      <CardTitle className="feed__content_featured_card_title text-base">Popular tags</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="w-2/3 md:w-1/4 lg:w-full flex-wrap">
                        {popularTags?.map((tag: any) => (
                          <Link href={`/tags/${tag.name}`} key={tag.id}>
                            <TagBadge className="my-1 mr-1" variant={"secondary"}>{tag.name}</TagBadge>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {topUsers && (
                  <FeaturedDev data={topUsers} />
                )}
                <Card className="feed__content_featured_card bg-background border-none shadow-none">
                    <CardHeader className="py-4 px-0">
                      <CardTitle className="feed__content_featured_card_title text-base">Recently saved</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {bookmarks.length !== 0 ? (
                        <ol className="flex flex-col items-start justify-between space-y-4">
                        {bookmarks?.map(
                          (item: any, index: number) => (
                            <li key={item.id} className="text-sm space-y-2.5">

                              <Link href={`/${item.post?.author.username}`} className="text-xs flex items-center mb-2 font-medium">
                                <Avatar className="h-5 w-5 mr-1 md:mr-1.5 ">
                                  <AvatarImage src={item.post?.author?.image} alt={item.post?.author?.username} />
                                  <AvatarFallback>{item.post?.author?.name?.charAt(0) || item.post?.author?.username?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {item.post?.author.name || item.post?.author.username} {item.post.author?.verified && (
                        <Icons.verified className="h-3 w-3 mx-0.5 inline fill-primary align-middle" />
                      )}
                              </Link>


                              <Link href={`/${item.post?.author.username}/${item.post?.url}`} className="text-base font-bold line-clamp-2 overflow-hidden">
                                {item.post?.title}
                              </Link>
                              <div className="text-muted-foreground">
                                <span className="text-xs">{item.post?.readingTime}</span>
                                <span className="text-xs mx-1">·</span>
                                <span className="text-xs">{dateFormat(item.post?.createdAt)}</span>
                              </div>
                            </li>
                          ))}
                        <li className="text-sm space-y-2.5">
                          <Link href={`#`} className="text-xs flex items-center mb-2 font-medium">
                            See all ({bookmarksCount})
                          </Link>
                        </li>
                      </ol>
                      ) : (
                        <EmptyPlaceholder className='min-h-min p-6'>
                          <EmptyPlaceholder.Icon name='bookmark' className='h-5 w-5' parentClassName='h-10 w-10' />
                          <EmptyPlaceholder.Description className='!my-2'>
                            You haven’t saved any posts yet. Click the bookmark icon on a post to save it here.
                          </EmptyPlaceholder.Description>
                        </EmptyPlaceholder>
                      )}
                    </CardContent>
                  </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}