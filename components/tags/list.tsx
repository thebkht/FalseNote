'use client';
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Button } from "../ui/button"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { cn } from "@/lib/utils"

export default function TagsList({ tags: initialTags, session, className, ...props }: { tags: any, session: any, className?: string } & React.ComponentPropsWithoutRef<typeof Card>) {
     const [tags, setTags] = useState<any>(initialTags)
     useEffect(() => {
          setTags(initialTags)
     }, [initialTags])
     const [isFollow, setIsFollow] = useState<boolean[]>(tags?.map((tag: any) => tag.followingtag.followerId === session?.id) || [])
     const [isFollowLoading, setIsFollowLoading] = useState<boolean[]>(tags?.map(() => false) || [])
     const [isLast, setIsLast] = useState<boolean>(false)
     const [page, setPage] = useState<number>(0)
     const [isLoading, setIsLoading] = useState<boolean>(false)

     async function loadMoreTags() {
          const next = page + 1
          setIsLoading(true)
          const result = await fetch(`api/tags?page=${next}`).then(res => res.json())
          const fetchedTags = result?.tags
          setIsLoading(false)
          if (fetchedTags?.length) {
               setPage(next)
               setTags((prev: any) => [...prev, ...fetchedTags])
          } else {
               setIsLast(true)
          }
     }

     const handleFollow = async (tagId: any, index: number) => {
          const newIsFollow = [...isFollow]
          const newIsFollowLoading = [...isFollowLoading]
          newIsFollowLoading[index] = true
          setIsFollowLoading(newIsFollowLoading)
          try {
               const response = await fetch(`/api/follow/tag?tagId=${tagId}&userId=${session?.id}`, {
                    method: "GET",
               });
               if (response.status === 200) {
                    newIsFollow[index] = true
                    setIsFollow(newIsFollow)
               } else {
                    newIsFollow[index] = false
                    setIsFollow(newIsFollow)
               }
               // set following loading to false
               newIsFollowLoading[index] = false
               setIsFollowLoading(newIsFollowLoading)
          } catch (error) {
               console.error(error);
               newIsFollowLoading[index] = false
               setIsFollowLoading(newIsFollowLoading)
          }
          await fetch(`/api/revalidate?path=/tags`, {
               method: "GET",
          });
          // router.refresh();
     }

     return (
          <>
               <Card className={cn("relative mb-6 lg:pr-5 lg:mr-5 bg-background border-none shadow-none", className)} {...props}>
                    <CardHeader className="px-0 md:pr-6 pt-0">
                         <CardTitle className="text-base">All featured Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 md:pr-6">
                         <div className="flex flex-col divide-y">
                              {tags?.map((tag: any, index: number) => (
                                   <div className="flex items-center justify-between py-5" key={tag.id}>
                                        <Link href={`/tags/${tag.name}`} className="w-full">
                                             <div className="flex items-center">
                                                  <Badge className="mr-3 h-12 w-12 rounded-md bg-muted" variant={"outline"}><Hash className="h-4 w-4 mx-auto" /></Badge>
                                                  <div className="space-y-1">
                                                       <p className="text-base capitalize">{tag.name.replace(/-/g, " ")}</p>
                                                       <p className="text-sm text-muted-foreground">{tag._count.posts} posts · {tag._count.followingtag} followers</p>
                                                  </div>
                                             </div>
                                        </Link>
                                        <Button variant="outline"  className="text-muted-foreground" onClick={async () => await handleFollow(tag.id, index)} disabled={isFollowLoading[index]}><>{isFollow[index] ? <>Following</> : <>Follow</>}</></Button>
                                   </div>
                              ))}
                              <div className="py-5">
                                   <Button variant="outline" size={"lg"} className="text-muted-foreground w-full" onClick={loadMoreTags} disabled={isLast}>{isLoading ? "Loading more" : "Load more"}...</Button>
                              </div>
                         </div>
                    </CardContent>
               </Card>
          </>
     )
}