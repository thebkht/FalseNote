'use server'
import postgres from "@/lib/postgres"
import { getSessionUser } from "./get-session-user"
import { revalidatePath } from "next/cache"

export const handlePostSave = async ({ postId, path} : {postId: number, path: string}) => {
     const sessionUser = await getSessionUser()
     if (!sessionUser) {
         console.log("No session user")
     }
     console.log(path, postId)
     try {
          const saved = await postgres.bookmark.findFirst({
               where: {
                    postId,
                    userId: Number(sessionUser?.id)
               }
          })

          if (saved) {
               await postgres.bookmark.delete({
                    where: {
                         id: saved.id
                    }
               })
               console.log("unsaved")
          } else {
               await postgres.bookmark.create({
                    data: {
                         userId: Number(sessionUser?.id),
                         postId
                    }
               })
               console.log("saved")
          }

          revalidatePath(path)
     } catch (error) {
          console.log(error)
     }
}