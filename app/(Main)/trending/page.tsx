import { EmptyPlaceholder } from "@/components/empty-placeholder"
import Posts from "@/components/explore/posts"
import { getSessionUser } from "@/components/get-session-user"
import { getPosts } from "@/lib/prisma/posts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeaturedDev from "@/components/feed/featured/featured-dev";
import { fetchUsers } from "@/components/feed/fetch-user";
import UserHorizontalCard from "@/components/user-horizontal-card";
import Users from "@/components/explore/users";

export default async function TrendingPage() {
     const session = await getSessionUser()

     const { posts } = await getPosts({ limit: 10 })
     const { users } = await fetchUsers({ limit: 10 })
     return (
          <div className="flex flex-col items-center pt-10">
          <div className="header">
                    <div className="header__content text-center py-10 space-y-2">
                         <h1 className="text-4xl font-semibold header__content__title">Trending</h1>
                         <p className="mx-auto text-muted-foreground text-lg">There are hot developers and posts</p>
                    </div>
               </div>
          <div className="w-2/3 mb-10">
          <Tabs className="w-full" defaultValue={"posts"}>
            <TabsList className="">
              <TabsTrigger value="posts" className="px-4">
                Posts
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="px-4">
                Developers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
            <Posts initialPosts={posts} session={session} />
            </TabsContent>
            <TabsContent value="bookmarks">
              <Users users={users} session={session} />
            </TabsContent>
          </Tabs>
          </div>
     </div>
     )
}