import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/components/settings/profile-form"
import { getSessionUser } from "@/components/get-session-user"
import postgres from "@/lib/postgres"
import { notFound } from "next/navigation"

export default async function SettingsProfilePage() {
  const user = await getSessionUser()
  const userData = await postgres.user.findUnique({
    where: { id: user?.id },
  })
  if (!userData) {
    return notFound()
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm data={userData} />
    </div>
  )
}