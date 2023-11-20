'use server'
import postgres from "@/lib/postgres"
import { Notification } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const notificationRead = async (id: Notification['id']) => {
     try {
          await postgres.notification.update({
               where: {
                    id: id
               },
               data: {
                    read: true
               }
          })
          revalidatePath(`/notifications`)
     } catch (error) {
          console.log(error)
     }
}