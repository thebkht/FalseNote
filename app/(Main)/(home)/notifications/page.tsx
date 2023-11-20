import { getSessionUser } from "@/components/get-session-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dateFormat } from "@/lib/format-date";
import postgres from "@/lib/postgres"
import { getNotifications } from "@/lib/prisma/session";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import NotificationList from "@/components/notifications/list";

export default async function NotificationPage() {
     const session = await getSessionUser();
     if (!session) redirect('/')
     const { notifications } = await getNotifications({ id: session.id });
     return (
          <>
               <NotificationList notifications={notifications} />
          </>
     )
}