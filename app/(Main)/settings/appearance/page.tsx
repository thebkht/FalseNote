import { Separator } from "@/components/ui/separator"
import { AppearanceForm } from "@/components/settings/appearance/appearance-form"
import { getSessionUser } from "@/components/get-session-user"
import { getSettings } from "@/lib/prisma/session"

export default async function SettingsAppearancePage() {
  const session = await getSessionUser()
  const data = await getSettings({id: session?.id})
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <Separator />
      <AppearanceForm data={data.settings} />
    </div>
  )
}