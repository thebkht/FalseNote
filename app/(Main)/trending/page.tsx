import { EmptyPlaceholder } from "@/components/empty-placeholder"
import Posts from "@/components/explore/posts"
import { getSessionUser } from "@/components/get-session-user"
import { getPosts } from "@/lib/prisma/posts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeaturedDev from "@/components/feed/featured/featured-dev";
import { fetchUsers } from "@/components/feed/fetch-user";

export default async function TrendingPage() {
     const session = await getSessionUser()

     const { posts } = await getPosts({ limit: 10 })
     const { users } = await fetchUsers({ limit: 10 })
     return (
          <div className="lg:px-20 space-y-6">
               <div className="header">
                    <div className="header__content text-center py-10 space-y-2">
                         <h1 className="text-4xl font-semibold header__content__title">Trending</h1>
                         <p className="mx-auto md:w-2/3 text-muted-foreground text-lg">There are hot developers and posts</p>
                    </div>
               </div>
               <div className="w-2/3 mb-10 mx-auto">
               <Tabs className="w-full" defaultValue={"posts"}>
            <TabsList className="bg-transparent gap-2">
              <TabsTrigger value="posts" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                Posts
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                Developers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="w-full">
            <Posts initialPosts={posts} session={session} />
            </TabsContent>
            <TabsContent value="bookmarks" className="w-full">
              <FeaturedDev data={users} />
            </TabsContent>
          </Tabs>
                    
                    </div>
          </div>
     )
}