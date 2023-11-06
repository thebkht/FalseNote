import { useRouter } from "next/navigation";
import { handleDelete } from "../delete";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "../ui/dialog";
import { Trash2 } from "lucide-react";


export default function PostDeleteDialog({ post, user, children, ...props }: React.ComponentPropsWithoutRef<typeof Dialog> & { post: any, user: any }) {
     const router = useRouter()
     return (
          <Dialog>
          <DialogTrigger>
               {children}
          </DialogTrigger>
          <DialogContent className="flex flex-col justify-center md:w-72">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
              <Trash2 className={"h-10 w-10"} strokeWidth={1.25} />
            </div>
            <div className="flex flex-col space-y-2 text-center sm:text-left mx-auto">
              <h1 className="text-lg font-semibold leading-none tracking-tight text-center">Delete Post</h1>
              <p className="text-sm text-muted-foreground text-center">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
            </div>
            <DialogFooter className="!flex-row">
              <DialogClose asChild>
                <Button className="m-auto" size={"lg"} variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={
                async () => {
                  handleDelete(post?.id, user)
                  await fetch(`/api/revalidate?path=/${user?.username}`)
                  router.push(`/${user?.username}`)
                }
              } className="m-auto" size={"lg"} variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
     )
}