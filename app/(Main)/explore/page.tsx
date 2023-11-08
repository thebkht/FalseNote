import { EmptyPlaceholder } from "@/components/empty-placeholder"
import Posts from "@/components/explore/posts"
import Search from "@/components/explore/search"
import { getSessionUser } from "@/components/get-session-user"
import { Icons } from "@/components/icon"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getPosts } from "@/lib/prisma/posts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { redirect } from "next/navigation"
import { Hash } from "lucide-react"
import { getUsers } from "@/lib/prisma/users"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import UserHoverCard from "@/components/user-hover-card"
import { searchTags } from "@/lib/prisma/tags"

export default async function Explore({
     searchParams
}: {
     searchParams: { [key: string]: string | string[] | undefined }
}) {

     const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
     const tab = typeof searchParams.tab === 'string' ? searchParams.tab : undefined
     if (tab) {
          if (tab !== 'posts' && tab !== 'users' && tab !== 'tags') {
               return redirect('/explore/')
          }
     }

     const activeTab = tab || 'top'

     const { posts } = await getPosts({ search, limit: 3 })
     const { users } = await getUsers({ search, limit: 3 })
     const { tags } = await searchTags({ search, limit: 3 })


     const session = await getSessionUser()
     // ...

     return (
          <>
               <div className="flex flex-col items-center pt-10 space-y-8">
                    <h2 className="font-medium text-4xl">Explore</h2>
                    <Search search={search} />
                    <Tabs defaultValue={activeTab} className="my-6">
                         <TabsList className="bg-transparent gap-2">
                              <TabsTrigger value={'top'} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   Trending
                              </TabsTrigger>
                              <TabsTrigger value={'posts'} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   Posts
                              </TabsTrigger>
                              <TabsTrigger value={'users'} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   Users
                              </TabsTrigger>
                              <TabsTrigger value={'tags'} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   Tags
                              </TabsTrigger>
                         </TabsList>
                    </Tabs>
                    <div className="w-full mb-10 space-y-4">
                         {posts.length > 0 && (
                              <Card>
                                   <CardHeader className="">
                                        <CardTitle className="feed__content_featured_card_title text-base">Posts</CardTitle>
                                   </CardHeader>
                                   <CardContent className="">
                                        <ol className="flex flex-col items-start justify-between space-y-4">
                                             {posts.map(
                                                  (item: any, index: number) => (
                                                       <li key={item.id} className="text-sm space-y-2.5">

                                                            <Link href={`/${item.author.username}`} className="text-xs flex items-center mb-2 font-medium">
                                                                 <Avatar className="h-5 w-5 mr-1 md:mr-1.5 ">
                                                                      <AvatarImage src={item.author?.image} alt={item.author?.username} />
                                                                      <AvatarFallback>{item.author?.name?.charAt(0) || item.author?.username?.charAt(0)}</AvatarFallback>
                                                                 </Avatar>
                                                                 {item.author.name || item.author.username} {item.author?.verified && (
                                                                      <Icons.verified className="h-3 w-3 mx-0.5 inline fill-primary align-middle" />
                                                                 )}
                                                            </Link>


                                                            <Link href={`/${item.author.username}/${item.url}`} className="text-base font-bold line-clamp-2 overflow-hidden leading-tight">
                                                                 {item.title}
                                                            </Link>
                                                       </li>
                                                  ))}
                                        </ol>
                                   </CardContent>
                                   <CardFooter className="flex justify-end">
                                        <Link href={`/explore?tab=posts${search !== undefined ? `&search=${search}` : ''}`} className="flex items-center text-sm text-muted-foreground font-medium">
                                             More
                                        </Link>
                                   </CardFooter>
                              </Card>

                         )}
                         {
                              users.length > 0 && (
                                   <Card>
                                        <CardHeader>
                                             <CardTitle className="feed__content_featured_card_title text-base">Users</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                             <div className="feed__content_featured_card_content flex flex-col items-start justify-between space-y-4">
                                                  {users?.map(
                                                       (item: any, index: number) => (
                                                            <div className="flex gap-4 w-full items-center justify-between" key={item.id}>
                                                                 <div className="space-y-3">
                                                                      <UserHoverCard user={item} >
                                                                           <Link href={`/${item.username}`} className="flex items-center">
                                                                                <Avatar className="mr-1.5 md:mr-2 flex items-center justify-center bg-muted h-8 w-8">
                                                                                     <AvatarImage src={item.image} alt={item.username} />
                                                                                     <AvatarFallback>{item.name?.charAt(0) || item.username?.charAt(0)}</AvatarFallback>
                                                                                </Avatar>
                                                                                {
                                                                                     !item.name ? (
                                                                                          <div>
                                                                                               <p className="text-sm font-medium leading-none">{item.username} {item?.verified && (
                                                                                                    <Icons.verified className="h-3 w-3 mx-1 inline fill-primary align-middle" />
                                                                                               )}</p>
                                                                                          </div>
                                                                                     ) : (
                                                                                          <div>
                                                                                               <p className="text-sm font-medium leading-none">{item.name} {item?.verified && (
                                                                                                    <Icons.verified className="h-3 w-3 inline fill-primary align-middle" />
                                                                                               )}</p>
                                                                                               <p className="text-sm text-muted-foreground">{item.username}</p>
                                                                                          </div>
                                                                                     )
                                                                                }
                                                                           </Link>
                                                                      </UserHoverCard>
                                                                 </div>
                                                            </div>
                                                       ))}
                                             </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-end">
                                        <Link href={`/explore?tab=users${search !== undefined ? `&search=${search}` : ''}`} className="flex items-center text-sm text-muted-foreground font-medium">
                                             More
                                        </Link>
                                   </CardFooter>
                                   </Card>
                              )
                         }
                         {tab === 'posts' && posts.length === 0 && search && (
                              <div className="flex flex-col items-center justify-center w-full">
                                   <EmptyPlaceholder>
                                        <EmptyPlaceholder.Icon name="post" strokeWidth={1.25} />
                                        <EmptyPlaceholder.Title>No posts found</EmptyPlaceholder.Title>
                                        <EmptyPlaceholder.Description>
                                             Try searching for something else.
                                        </EmptyPlaceholder.Description>
                                   </EmptyPlaceholder>
                              </div>
                         )
                         }
                    </div>
               </div>
          </>
     )
}