'use server'
import postgres from "@/lib/postgres"
import { getSessionUser } from "./get-session-user"
import { revalidatePath } from "next/cache"
import { create } from "@/lib/notifications/create-notification"
import { ObjectId } from "bson"
import { Comment } from "@prisma/client"

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
                    const data = await postgres.like.create({
                         data: {
                              id: new ObjectId().toHexString(),
                              authorId: sessionUser.id,
                              postId
                         },
                         select: {
                              post: {
                                   select: {
                                        author: true,
                                        title: true,
                                        url: true
                                   }
                              }
                         }
                    })
                    const message = `${data.post.title}` as string
                    await create({
                         type: "postLike",
                         content: message,
                         senderId: sessionUser.id,
                         receiverId: data.post.author.id,
                         url: `/@${data.post.author.username}/${data.post.url}`
                    })
               }
               
               revalidatePath(path)
          }
     } catch (error) {
          console.log(error)
     }
}

export const handleCommentLike = async ({ commentId, path} : {commentId: Comment['id'], path: string}) => {
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
                    const data = await postgres.commentLike.create({
                         data: {
                              id: new ObjectId().toHexString(),
                              authorId: sessionUser?.id,
                              commentId
                         },
                         select: {
                              comment: {
                                   select: {
                                        author: true,
                                        content: true,
                                        post: true,
                                   }
                              }
                         }
                    })

                    const message = `${data.comment.content}` as string
                    await create({
                         type: "commentLike",
                         content: message,
                         senderId: sessionUser.id,
                         receiverId: data.comment.author.id,
                         url: `/@${data.comment.author.username}/${data.comment.post.url}?commentsOpen=true`
                    })
                    revalidatePath(`/notifications`)
               }
     
               revalidatePath(path)
          }
     } catch (error) {
          console.log(error)
     }
}