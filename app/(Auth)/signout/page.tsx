"use client"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/auth/user-auth-form"
import { Icons } from "@/components/icon"
import { ModeToggle } from "@/components/mode-toggle"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignoutPage() {
  const router = useRouter()
  async function signout() {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <>
      <div className="container relative h-screen w-screen">
        <div className="lg:p-8 h-screen w-full">
        <Link href="/" className="absolute w-full left-0 top-8">
            <Icons.logo className="!h-10" style={{margin: "auto"}} />
          </Link>
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[320px] h-full">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
              Are you sure you want to sign out?
              </h1>
              <p className="text-sm text-muted-foreground">
              You can always sign back in at any time.
              </p>
            </div>
            <Button size={"lg"} className="w-full" onClick={() => signout()}>
              Sign out
            </Button>
            <p className="px-8 text-center text-sm text-muted-foreground">
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
          </div>
        </div>
      </div>
    </>
  )
}