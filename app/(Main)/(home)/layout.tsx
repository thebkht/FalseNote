import { EmptyPlaceholder } from "@/components/empty-placeholder";
import FeaturedDev from "@/components/feed/featured/featured-dev";
import { fetchUsers } from "@/components/feed/fetch-user";
import { fetchTags } from "@/components/feed/get-tags";
import PopularPosts from "@/components/feed/popular-posts"
import { SiteFooter } from "@/components/footer";
import { getSessionUser } from "@/components/get-session-user";
import { Icons } from "@/components/icon";
import TagBadge from "@/components/tags/tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dateFormat } from "@/lib/format-date";
import { getBookmarks } from "@/lib/prisma/session";
import { Metadata } from "next"
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomeLayout({
     children,
}: {
     children: React.ReactNode
}) {
     const session = await getSessionUser();
     if (!session) {
          return redirect('/')
     }
     const topData = await fetchUsers({ id: session.id })
     const topUsers = topData?.users;
     const popularTags = await fetchTags();

     const { bookmarks, bookmarksCount } = await getBookmarks({ id: session.id, limit: 3 })
     return (
          <>
               <div className="md:container mx-auto px-4">
                    <main className="flex flex-col items-center justify-between feed xl:px-4">
                         <div className="md:flex lg:flex-nowrap flex-wrap md:mx-[-16px] mt-5 w-full xl:gap-8 md:gap-4">
                              <div className="md:my-4 w-full lg:w-2/3">
                                   {children}
                              </div>
                              <div className="hidden lg:block md:my-4 lg:w-1/3 xl:pl-8 md:pl-4 border-l min-h-screen">
                                   <div className="relative w-full h-full inline-block">
                                        <div className="sticky space-y-4 top-[90px]">
                                             <PopularPosts />
                                             {popularTags.length !== 0 && (
                                                  <Card className="feed__content_featured_card bg-background">
                                                       <CardHeader className="p-4">
                                                            <CardTitle className="feed__content_featured_card_title text-base">Popular tags</CardTitle>
                                                       </CardHeader>
                                                       <CardContent className="px-4">
                                                            <div className="w-2/3 md:w-1/4 lg:w-full flex-wrap pb-4">
                                                                 {popularTags?.map((tag: any) => (
                                                                      <Link href={`/tags/${tag.name}`} key={tag.id}>
                                                                           <TagBadge className="my-1 mr-1" variant={"secondary"}>{tag.name}</TagBadge>
                                                                      </Link>
                                                                 ))}
                                                            </div>
                                                            <Link href={`/tags`} className="text-xs flex items-center font-medium">
                                                                 See more tags
                                                            </Link>
                                                       </CardContent>
                                                  </Card>
                                             )}
                                             {topUsers && (
                                                  <FeaturedDev data={topUsers} />
                                             )}
                                             <Card className="feed__content_featured_card bg-background">
                                                  <CardHeader className="p-4">
                                                       <CardTitle className="feed__content_featured_card_title text-base">Recently saved</CardTitle>
                                                  </CardHeader>
                                                  <CardContent className="px-4 pb-0">
                                                       {bookmarks.length !== 0 ? (
                                                            <>
                                                            <ol className="flex flex-col items-start justify-between space-y-4">
                                                                 {bookmarks?.map(
                                                                      (item: any, index: number) => (
                                                                           <li key={item.id} className="text-sm space-y-2.5">

                                                                                <Link href={`/@${item.post?.author.username}`} className="text-xs flex items-center mb-2 font-medium">
                                                                                     <Avatar className="h-5 w-5 mr-1 md:mr-1.5 ">
                                                                                          <AvatarImage src={item.post?.author?.image} alt={item.post?.author?.username} />
                                                                                          <AvatarFallback>{item.post?.author?.name?.charAt(0) || item.post?.author?.username?.charAt(0)}</AvatarFallback>
                                                                                     </Avatar>
                                                                                     {item.post?.author.name || item.post?.author.username} {item.post.author?.verified && (
                                                                                          <Icons.verified className="h-3 w-3 mx-0.5 inline fill-primary align-middle" />
                                                                                     )}
                                                                                </Link>


                                                                                <Link href={`/@${item.post?.author.username}/${item.post?.url}`} className="text-base font-bold line-clamp-2 overflow-hidden">
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
                                                                      
                                                                 </li>
                                                            </ol>
                                                            <CardFooter className="px-0 py-4">
                                                                 <Link href={`/@${session.username}?tab=bookmarks`} className="text-xs flex items-center mb-2 font-medium">
                                                                           See all ({bookmarksCount})
                                                                      </Link>
                                                            </CardFooter>
                                                            </>
                                                       ) : (
                                                            <EmptyPlaceholder className='min-h-min p-6'>
                                                                 <EmptyPlaceholder.Icon name='bookmark' className='h-5 w-5' parentClassName='h-10 w-10' />
                                                                 <EmptyPlaceholder.Description className='!my-2'>
                                                                      You haven&apos;t saved any posts yet. Click the bookmark icon on a post to save it here.
                                                                 </EmptyPlaceholder.Description>
                                                            </EmptyPlaceholder>
                                                       )}
                                                  </CardContent>
                                             </Card>
                                             <SiteFooter className='text-xs !px-0' />
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </main>
               </div>
          </>
     )
}
