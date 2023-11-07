'use client'
import { Icons } from "@/components/icon"
import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
     AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import TagBadge from "../tags/tag"
import { Button } from "../ui/button"
import { Check, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function TagsDialog({ tags: initialTags, session, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialog> & { tags: any, session: any }) {
     const router = useRouter()

     const [tags, setTags] = useState<any[]>(initialTags?.filter((tag: any) => tag.followingtag?.followerId !== session?.id))
     const [followingTags, setFollowingTags] = useState<any[]>(initialTags?.filter((tag: any) => tag.followingtag?.followerId === session?.id));


     const [isFollow, setIsFollow] = useState<boolean[]>(tags?.map((tag: any) => tag.followingtag?.followerId === session?.id) || [])
     useEffect(() => {
          // set tags where not in followingTags
          setTags(initialTags?.filter((tag: any) => tag.followingtag?.followerId !== session?.id))
          setIsFollow(initialTags?.map((tag: any) => tag.followingtag?.followerId === session?.id) || [])
     }, [initialTags, session]) // Added session?.id to the dependency array
     const [isFollowLoading, setIsFollowLoading] = useState<boolean[]>(tags?.map(() => false) || [])
     const [isLast, setIsLast] = useState<boolean>(false)
     const [page, setPage] = useState<number>(0)

     async function loadMoreTags() {
          const next = page + 1
          const result = await fetch(`api/tags?page=${next}`).then(res => res.json())
          const fetchedTags = result?.tags
          if (fetchedTags?.length) {
               setPage(next)
               setTags(fetchedTags)
          } else {
               setPage(-1)
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
                    // Check if tag is already in followingTags
                    const isTagInFollowingTags = followingTags.some((tag: any) => tag.id === tagId);
                
                    if (isTagInFollowingTags) {
                        // If tag is in followingTags, remove it
                        setFollowingTags(followingTags.filter((tag: any) => tag.id !== tagId));
                        // And add it to tags
                        setTags([...tags, followingTags[index]]);
                    } else {
                        // If tag is not in followingTags, add it
                        setFollowingTags([...followingTags, tags[index]]);
                        // And remove it from tags
                        setTags(tags.filter((tag: any) => tag.id !== tagId));
                    }
                }
          } catch (error) {
               console.error(error);
               newIsFollowLoading[index] = false
               setIsFollowLoading(newIsFollowLoading)
          }
          await fetch(`/api/revalidate?path=/tags`, {
               method: "GET",
          });
     }

     return (
          <AlertDialog {...props}>
               <AlertDialogContent className="">
                    <AlertDialogHeader className="justify-center">
                         <Link href={'/'} className="mx-auto"><Icons.logo className="md:h-5 mt-5 mb-8" /></Link>
                         <AlertDialogTitle className="mx-auto text-xl">What are you interested in?</AlertDialogTitle>
                         <AlertDialogDescription className="mt-4">
                              Choose three or more topics to follow so we can personalize your feed.
                         </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex flex-wrap justify-center mt-8">
                         {followingTags?.map((tag: any, index) => (
                              <TagBadge key={tag.id} className="bg-primary text-sm py-1.5 px-2.5 rounded-full mr-1.5 mb-1.5 text-primary-foreground capitalize">
                                   <Button variant={'ghost'} className="h-fit w-fit !p-0 mr-2.5 hover:bg-transparent hover:text-primary-foreground" onClick={async () => await handleFollow(tag.id, index)}><Check className="h-4 w-4" /></Button>
                                   {tag?.name?.replace(/-/g, ' ')}
                              </TagBadge>
                         ))}
                         {tags?.map((tag: any, index: number) => (
                              <TagBadge key={tag.id} className="text-sm py-1.5 px-2.5 rounded-full mr-1.5 mb-1.5 capitalize">
                                   <Button variant={'ghost'} className="h-fit w-fit !p-0 mr-2.5 hover:bg-transparent hover:text-primary-foreground" onClick={async () => await handleFollow(tag.id, index)}>{isFollow[index] ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</Button>
                                   {tag.name?.replace(/-/g, ' ')}
                              </TagBadge>
                         ))}
                    </div>
                    {!isLast ? (
                         <Button variant={'link'} className="text-sm py-2 px-4 rounded-full mr-1.5 mb-1.5 w-max mx-auto" onClick={loadMoreTags}>
                              See more
                         </Button>
                    ) : (
                         <Button variant={'link'} className="text-sm py-2 px-4 rounded-full mr-1.5 mb-1.5 w-max mx-auto" onClick={() => {
                              loadMoreTags()
                              setIsLast(false)
                         }}>
                              Start over
                         </Button>
                    )}
                    <AlertDialogFooter className="sm:justify-center">
                         <AlertDialogAction className="h-10 rounded-md px-8" onClick={() => router.push('/feed')} disabled={
                              followingTags.length < 3
                         }>Continue</AlertDialogAction>
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     )
}