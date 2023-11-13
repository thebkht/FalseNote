'use client'

import { usePathname, useRouter } from "next/navigation"
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog"
import Link from "next/link"
import { UserAuthForm } from "./user-auth-form"
import { Icons } from "../icon"
import { AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog"

export default function SigninDialog({ ...props }: React.ComponentPropsWithoutRef<typeof AlertDialog>) {
     const pathname = usePathname()
     const router = useRouter()
     return (
          <AlertDialog {...props}>
               <AlertDialogContent className="flex flex-col justify-center !rounded-lg">
                    <AlertDialogHeader className="justify-center">
                         <Link href={'/'} className="mx-auto"><Icons.logo className="md:h-5 mt-5 mb-8" /></Link>
                         <AlertDialogTitle className="mx-auto text-xl">Create an account</AlertDialogTitle>
                         <AlertDialogDescription className="mt-4 text-center">
                              Sign up with your GitHub account to continue.
                         </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[320px] my-10">
                         <UserAuthForm />

                    </div>
                    <AlertDialogFooter className="!flex-row !justify-center space-x-2">
                         <p className="px-8 text-center text-sm text-muted-foreground">
                              By clicking continue, you agree to our{" "}
                              <Link
                                   href="/terms"
                                   className="underline underline-offset-4 hover:text-primary"
                              >
                                   Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link
                                   href="/privacy"
                                   className="underline underline-offset-4 hover:text-primary"
                              >
                                   Privacy Policy
                              </Link>
                              .
                         </p>
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     )
}