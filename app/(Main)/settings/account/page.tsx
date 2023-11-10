import { Separator } from "@/components/ui/separator"
import { AccountForm } from "@/components/settings/account/account-form"
import { getSessionUser } from "@/components/get-session-user"
import postgres from "@/lib/postgres"

export default async function SettingsAccountPage() {
  const user = await getSessionUser()
  const userData = await postgres.user.findUnique({
    where: { id: user?.id },
  })
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  )
}