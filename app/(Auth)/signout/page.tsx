import { redirect } from "next/navigation"
import SignOutDialog from "@/components/auth/signout-dialog"
import { getSessionUser } from "@/components/get-session-user"

export default async function SignoutPage() {
  const session = await getSessionUser()
  if (!session) {
    redirect("/")
  }
  return (
    <>
      <div className="container relative h-screen w-screen">
        <SignOutDialog open />
      </div>
    </>
  )
}