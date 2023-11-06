import { EmptyPlaceholder } from "@/components/empty-placeholder"
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
                    <div className="w-2/3 mb-10">
                    {posts.length > 0 && <Posts initialPosts={posts} search={search} session={session} />}
                    {posts.length === 0 && search && (
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