import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"

export default function NotFound() {
  return (
    <AlertDialog open>
      <AlertDialogContent className="p-0 border-none">
        <EmptyPlaceholder className="w-full">
          <EmptyPlaceholder.Icon name="warning" />
          <EmptyPlaceholder.Title>Uh oh! Not Found</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            This tag cound not be found. Please try again.
          </EmptyPlaceholder.Description>
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            Go to Home
          </Link>
        </EmptyPlaceholder>
      </AlertDialogContent>
    </AlertDialog>
  )
}