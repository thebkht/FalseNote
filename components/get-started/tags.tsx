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
import { Plus } from "lucide-react"

export default function TagsDialog({ tags, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialog> & { tags: any }) {
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
                              {tags.map((tag: any) => (
                                    <TagBadge key={tag.id} className="text-sm py-1.5 px-2.5 rounded-full mr-1.5 mb-1.5 capitalize">
                                        {tag.name.replace(/-/g, ' ')}
                                        <Button variant={'ghost'} className="h-fit w-fit !p-0 ml-2.5 hover:bg-transparent hover:text-primary-foreground"><Plus className="h-4 w-4" /></Button>
                                        </TagBadge>
                              ))}
                         </div>
                         <Button variant={'link'} className="text-sm py-2 px-4 rounded-full mr-1.5 mb-1.5 capitalize">
                                   See more
                              </Button>
                         <AlertDialogFooter className="sm:justify-center">
                              <AlertDialogAction>Continue</AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
     )
}