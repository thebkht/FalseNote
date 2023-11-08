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
import { Badge } from "@/components/ui/badge"
import ExploreComponent from "@/components/explore/tab-content"

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

     let { posts } = await getPosts({ search, limit: 3 })
     let { users } = await getUsers({ search, limit: 3 })
     let { tags } = await searchTags({ search, limit: 3 })

     const session = await getSessionUser()
     // ...

     return (
          <>
               <div className="flex flex-col items-center py-10 space-y-8">
                    <h2 className="font-medium text-4xl">Explore</h2>
                    <Search search={search} />
                    <Tabs defaultValue={activeTab} className="my-6 space-y-8">
                         <TabsList className="bg-transparent gap-2 justify-center w-full">
                              <TabsTrigger value={'top'} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   <Link href={`/explore${search !== undefined ? `?search=${search}` : ''}`}>
                                   Trending
                                   </Link>
                              </TabsTrigger>
                              <TabsTrigger value={'posts'} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   <Link href={`/explore?tab=posts${search !== undefined ? `&search=${search}` : ''}`}>
                                   Posts
                                   </Link>
                              </TabsTrigger>
                              <TabsTrigger value={'users'} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   <Link href={`/explore?tab=users${search !== undefined ? `&search=${search}` : ''}`}>
                                   Users
                                   </Link>
                              </TabsTrigger>
                              <TabsTrigger value={'tags'} className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                                   <Link href={`/explore?tab=tags${search !== undefined ? `&search=${search}` : ''}`}>
                                   Tags
                                   </Link>
                              </TabsTrigger>
                         </TabsList>
                         <TabsContent value={'top'}>
                              <ExploreComponent users={users} posts={posts} tags={tags} session={session} search={search} tab={tab} activeTab={activeTab} searchParams={searchParams} />
                         </TabsContent>
                    </Tabs>
                    <div className="w-full mb-10 space-y-4">
                         

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