"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  async function signin(provider: string) {
    await signIn(provider, { callbackUrl: "/feed" })
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button variant="outline" type="button" disabled={isLoading} onClick={() => signin("github")}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button>
    </div>
  )
}