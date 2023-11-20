'use server'
import postgres from "@/lib/postgres"
import { getSessionUser } from "./get-session-user"
import { revalidatePath } from "next/cache"

export const handlePostSave = async ({ postId, path} : {postId: string, path: string}) => {
     const sessionUser = await getSessionUser()
     if (!sessionUser) {
         console.log("No session user")
     }
     try {
          const saved = await postgres.bookmark.findFirst({
               where: {
                    postId,
                    userId: sessionUser?.id
               }
          })

          if (sessionUser?.id) {
               if (saved) {
                 await postgres.bookmark.delete({
                   where: {
                     id: saved.id
                   }
                 })
               } else {
                 await postgres.bookmark.create({
                   data: {
                     userId: sessionUser.id,
                     postId
                   }
                 })
               }
             
               revalidatePath(path)
             }
     } catch (error) {
          console.log(error)
     }
}