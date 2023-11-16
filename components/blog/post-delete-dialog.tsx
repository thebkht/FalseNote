import { useRouter } from "next/navigation";
import { handleDelete } from "../delete";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react";
import { validate } from "@/lib/revalidate";


export default function PostDeleteDialog({ post, user, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialog> & { post: any, user: any }) {
     const router = useRouter()
     return (
          <AlertDialog {...props}>
          <AlertDialogContent className="flex flex-col justify-center !w-72 !rounded-lg">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
              <Trash2 className={"h-10 w-10"} strokeWidth={1.25} />
            </div>
            <div className="flex flex-col space-y-2 text-center sm:text-left mx-auto">
              <h1 className="text-lg font-semibold leading-none tracking-tight text-center">Delete Post</h1>
              <p className="text-sm text-muted-foreground text-center">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
            </div>
            <AlertDialogFooter className="!flex-row !justify-center space-x-2">
              <AlertDialogCancel className="mt-0">
              Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={
                async () => {
                  handleDelete(post?.id, user)
                  await validate(`/@${user?.username}`)
                  router.push(`/@${user?.username}`)
                }
              } className="bg-red-600 focus:ring-red-600">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
     )
}