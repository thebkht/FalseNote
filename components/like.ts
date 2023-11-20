'use server'
import postgres from "@/lib/postgres"
import { getSessionUser } from "./get-session-user"
import { revalidatePath } from "next/cache"

export const handlePostLike = async ({ postId, path} : {postId: string, path: string}) => {
     const sessionUser = await getSessionUser()
     if (!sessionUser) {
         console.log("No session user")
     }
     try {
          const liked = await postgres.like.findFirst({
               where: {
                    postId,
                    authorId: sessionUser?.id
               }
          })

          if(sessionUser?.id) {
               if (liked) {
                    await postgres.like.delete({
                         where: {
                              id: liked.id
                         }
                    })
               } else {
                    await postgres.like.create({
                         data: {
                              authorId: sessionUser.id,
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

export const handleCommentLike = async ({ commentId, path} : {commentId: number, path: string}) => {
     const sessionUser = await getSessionUser()
     if (!sessionUser) {
          console.log("No session user")
     }
     console.log(path, commentId)
     try {
          const liked = await postgres.commentLike.findFirst({
               where: {
                    commentId,
                    authorId: sessionUser?.id
               }
          })

          if(sessionUser) {
               if (liked) {
                    await postgres.commentLike.delete({
                         where: {
                              id: liked.id
                         }
                    })
               } else {
                    await postgres.commentLike.create({
                         data: {
                              authorId: sessionUser?.id,
                              commentId
                         }
                    })
               }
     
               revalidatePath(path)
          }
     } catch (error) {
          console.log(error)
     }
}