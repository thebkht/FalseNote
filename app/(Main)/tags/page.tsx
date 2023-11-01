import { getSessionUser } from "@/components/get-session-user"
import TagsList from "@/components/tags/list"
import TagBadge from "@/components/tags/tag"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import postgres from "@/lib/postgres"
import { getPopularTags, getTags } from "@/lib/prisma/tags"
import { Hash } from "lucide-react"
import Link from "next/link"

export default async function TagsPage() {
     const session = await getSessionUser()

     const {tags} = await getTags({id: session?.id})
     const { tags: popularTags } = await getPopularTags({id: session?.id, take: 10})

     return (
          <div className="container !px-20 space-y-6">
               <div className="header">
                    <div className="header__content text-center py-6 space-y-2">
                         <h1 className="text-3xl font-semibold header__content__title">Tags</h1>
                         <p className="mx-auto md:w-2/3 text-muted-foreground">Explore popular tags on FalseNotes</p>
                    </div>
               </div>
               <div className="flex justify-between w-full">
               <div className="lg:w-3/4">
               <TagsList tags={tags} session={session} />
               </div>
               <div className="lg:w-1/4">
                    <h2 className="mb-2 font-semibold">Popular tags</h2>
                    {/* col-sm-6 col-md-4 col-lg-12 list-style-none flex-wrap */}
                    <div className="w-2/3 md:w-1/4 lg:w-full flex-wrap">
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