import { EmptyPlaceholder } from "@/components/empty-placeholder"
import Posts from "@/components/explore/posts"
import { getSessionUser } from "@/components/get-session-user"
import { getPosts } from "@/lib/prisma/posts"

export default async function TrendingPage() {
     const session = await getSessionUser()

     const { posts } = await getPosts({ limit: 10 })
     return (
          <div className="lg:px-20 space-y-6">
               <div className="header">
                    <div className="header__content text-center py-10 space-y-2">
                         <h1 className="text-4xl font-semibold header__content__title">Trending</h1>
                         <p className="mx-auto md:w-2/3 text-muted-foreground text-lg">There are hot developers and posts</p>
                    </div>
               </div>
               <div className="w-2/3 mb-10 mx-auto">
                    {posts.length > 0 && <Posts initialPosts={posts} session={session} />}
                    {posts.length === 0 && (
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
     )
}