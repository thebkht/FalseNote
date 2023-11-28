'use client'
import { usePathname, useRouter } from "next/navigation";
import { handleDeleteComment } from "@/components/delete";
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
import { Trash2 } from "lucide-react";
import { Icons } from "@/components/icon";


export default function CommentDeleteDialog({ comment, user, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialog> & { comment: any, user: any }) {
     const pathname = usePathname()
     const router = useRouter()
     return (
          <AlertDialog {...props}>
          <AlertDialogContent className="flex flex-col justify-center !w-72 !rounded-lg">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
              <Icons.trash className={"h-10 w-10"} />
            </div>
            <div className="flex flex-col space-y-2 text-center sm:text-left mx-auto">
              <h1 className="text-lg font-semibold leading-none tracking-tight text-center">Delete Comment</h1>
              <p className="text-sm text-muted-foreground text-center">
                Are you sure you want to delete this comment? This action cannot be undone.
              </p>
            </div>
            <AlertDialogFooter className="!flex-row !justify-center space-x-2">
              <AlertDialogCancel className="mt-0">
              Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={
                async () => {
                    await handleDeleteComment(comment?.id, pathname)
                    router.refresh()
                }
              } className="bg-red-600 focus:ring-red-600">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
     )
}