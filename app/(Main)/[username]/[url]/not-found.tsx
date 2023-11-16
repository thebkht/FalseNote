import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"
import Image from "next/image"

export default function NotFound() {
  return (
    <>
      <div className="h-screen w-screen absolute z-20 left-0 top-0">
      <Image src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75" width={1920} height={1080} alt="404 image" className="object-top object-cover w-full h-full" /> 
      </div>
    <AlertDialog open>
      <AlertDialogContent className="p-0 border-none">
        <EmptyPlaceholder className="w-full">
          <EmptyPlaceholder.Icon name="warning" />
          <EmptyPlaceholder.Title>Uh oh! Not Found</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            This post cound not be found or has been deleted. If you think this is a mistake, please contact us.
          </EmptyPlaceholder.Description>
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            Go to Home
          </Link>
        </EmptyPlaceholder>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}