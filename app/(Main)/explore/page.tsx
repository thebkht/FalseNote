import Posts from "@/components/explore/posts"
import Search from "@/components/explore/search"
import { getSessionUser } from "@/components/get-session-user"
import { getPosts } from "@/lib/prisma/posts"
import { getUsers } from "@/lib/prisma/users"
import { searchTags } from "@/lib/prisma/tags"
import ExploreComponent from "@/components/explore/tab-content"
import ExploreTab from "@/components/explore/tab"
import Users from "@/components/explore/users"
import Tags from "@/components/explore/tags"

export default async function Explore({
     searchParams
}: {
     searchParams: { [key: string]: string | string[] | undefined }
}) {

     const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
     const tab = typeof searchParams.tab === 'string' ? searchParams.tab : undefined

     let { posts } = await getPosts({ search, limit: 3 })
     let { users } = await getUsers({ search, limit: 3 })
     let { tags } = await searchTags({ search, limit: 3 })
     tab === 'posts' && (posts = await getPosts({ search, limit: 5 }).then(res => res.posts))
     tab === 'users' && (users = await getUsers({ search, limit: 5 }).then(res => res.users))
     tab === 'tags' && (tags = await searchTags({ search, limit: 5 }).then(res => res.tags))
     const session = await getSessionUser()
     // ...

     return (
          <>
               <div className="flex flex-col items-center py-10 space-y-8">
                    <h2 className="font-medium text-4xl">Explore</h2>
                    <Search search={search} />
                    <ExploreTab activeTab={tab} search={search} />
                    {tab === undefined && (
                         <ExploreComponent users={users} posts={posts} tags={tags} session={session} search={search} className="md:w-[600px]" />
                    )}
                    {tab === 'posts' && (
                         <Posts initialPosts={posts} session={session} search={search} />
                    )}
                    {tab === 'users' && (
                         <Users users={users} session={session} search={search} />
                    )}
                    {tab === 'tags' && (
                         <Tags tags={tags} session={session} search={search} />
                    )}
                    {/* <div className="w-full mb-10 space-y-4">


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
                    </div> */}
               </div>
          </>
     )
}