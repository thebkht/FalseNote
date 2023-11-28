import { getSessionUser } from "@/components/get-session-user"
import TagsList from "@/components/tags/list"
import TagBadge from "@/components/tags/tag"
import { getPopularTags, getTags } from "@/lib/prisma/tags"
import Link from "next/link"

export default async function TagsPage() {
     const session = await getSessionUser()

     const {tags} = await getTags({id: session?.id})
     const { tags: popularTags } = await getPopularTags({id: session?.id, take: 10})

     return (
          <div className="lg:px-20 space-y-6">
               <div className="header">
                    <div className="header__content text-center py-10 space-y-2">
                         <h1 className="text-4xl font-semibold header__content__title">Tags</h1>
                         <p className="mx-auto md:w-2/3 text-muted-foreground text-lg">Explore popular tags on FalseNotes</p>
                    </div>
               </div>
               <div className="flex justify-between w-full flex-col-reverse md:flex-row">
               <div className="w-full md:w-2/3 lg:w-3/4">
               <TagsList tags={tags} session={session} />
               </div>
               <div className="w-full md:w-1/3 lg:w-1/4 py-4">
                    <h2 className="mb-2 font-semibold">Popular tags</h2>
                    {/* col-sm-6 col-md-4 col-lg-12 list-style-none flex-wrap */}
                    <div className="w-full flex-wrap">
                         {popularTags.map((tag: any) => (
                              <Link href={`/tags/${tag.name}`} key={tag.id}>
                                   <TagBadge className="my-1 mr-1" variant={"secondary"}>{tag.name}</TagBadge>
                              </Link>
                         ))}
                    </div>
               </div>
               </div>
          </div>
     )
}