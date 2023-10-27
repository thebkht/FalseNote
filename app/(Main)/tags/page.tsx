import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import postgres from "@/lib/postgres"
import { Hash } from "lucide-react"
import Link from "next/link"

export default async function TagsPage() {
     let page = 0
     const tags = await postgres.tag.findMany({
          take: 5,
          orderBy: {
               posts: {
                    _count: "desc"
               }
          },
          include: {
               _count: { select: { posts: true, followingtag: true } },
          },
          skip: page * 5
     })

     const popularTags = await postgres.tag.findMany({
          take: 10,
          orderBy: {
               followingtag: {
                    _count: "desc"
               }
          }
     })

     return (
          <div className="py-8 container !px-20 space-y-6">
               <div className="header">
                    <div className="header__content text-center py-6 space-y-2">
                         <h1 className="text-3xl font-semibold header__content__title">Tags</h1>
                         <p className="mx-auto md:w-2/3 text-muted-foreground">Explore popular tags on FalseNotes</p>
                    </div>
               </div>
               <div className="flex justify-between w-full">
               <div className="lg:w-3/4">
               <Card className="relative mb-6 lg:pr-5 lg:mr-5 lg:w-3/4 bg-background border-none">
                    <CardHeader>
                         <CardTitle>All featured Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="flex flex-col gap-2">
                              {tags.map((tag) => (
                                   <div className="flex items-center justify-between py-2" key={tag.id}>
                                        <Link href={`/tags/${tag.name}`} className="w-full">
                                             <div className="flex items-center">
                                                  <Badge className="mr-3 h-14 w-14 rounded-md bg-muted" variant={"outline"}><Hash className="h-4 w-4 mx-auto" /></Badge>
                                                  <div className="space-y-1">
                                                  <p className="text-xl capitalize">{tag.name}</p>
                                                  <p className="text-muted-foreground">{tag._count.posts} posts · {tag._count.followingtag} followers</p>
                                                  </div>
                                             </div>
                                        </Link>
                                        <Button variant="outline" size={"lg"} className="text-muted-foreground">Follow</Button>
                                   </div>
                              ))}
                         </div>
                    </CardContent>
               </Card>
               </div>
               <div className="lg:w-1/4">
                    <h2 className="mb-2 font-semibold">Popular tags</h2>
                    {/* col-sm-6 col-md-4 col-lg-12 list-style-none flex-wrap */}
                    <div className="w-2/3 md:w-1/4 lg:w-full flex-wrap">
                         {popularTags.map((tag) => (
                              <Link href={`/tags/${tag.name}`} key={tag.id}>
                                   <Badge className="bg-primary/30 text-primary px-2.5 my-1 mr-1 hover:text-primary-foreground hover:bg-primary" variant={"secondary"}>{tag.name}</Badge>
                              </Link>
                         ))}
                    </div>
               </div>
               </div>
          </div>
     )
}