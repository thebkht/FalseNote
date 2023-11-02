import Posts from "@/components/explore/posts"
import Search from "@/components/explore/search"
import { getSessionUser } from "@/components/get-session-user"
import { Input } from "@/components/ui/input"
import { getPosts } from "@/lib/prisma/posts"

export default async function Explore({
     searchParams
}: {
     searchParams: { [key: string]: string | string[] | undefined }
}) {

     const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

     const { posts } = await getPosts({ search, limit: 5 })
     const session = await getSessionUser()
     return (
          <>
               <div className="flex flex-col items-center pt-10">
                    <h2 className="font-medium text-4xl">Explore</h2>
                    <Search search={search} />
                    {posts.length > 0 && <Posts initialPosts={posts} search={search} session={session} />}
                    {posts.length === 0 && search && (
                         <div className="w-full max-h-screen my-auto flex justify-center items-center bg-background">
                              <div className="flex flex-col items-center justify-center space-y-4">
                                   <h1 className="text-2xl font-bold">No posts found</h1>
                                   <p className="text-muted-foreground">Try searching for something else.</p>
                              </div>
                         </div>)
                    }
               </div>
          </>
     )
}