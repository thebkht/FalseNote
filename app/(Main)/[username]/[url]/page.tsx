'use server'
import { getSessionUser } from "@/components/get-session-user"
import { notFound } from "next/navigation"
import postgres from "@/lib/postgres"
import Post from "@/components/blog/post"
import { cookies } from 'next/headers'

export default async function PostView({ params, searchParams }: { params: { username: string, url: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
     const commentsOpen = typeof searchParams.commentsOpen === 'string' ? searchParams.commentsOpen : undefined

     const decodedUsername = decodeURIComponent(params.username);
     const author = await postgres.user.findFirst({
          where: {
               username: decodedUsername.substring(1)
          },
          include: {
               _count: { select: { posts: true, Followers: true, Followings: true } },
               Followers: true,
               Followings: true
          }
     });
     const post = await postgres.post.findFirst({
          where: {
               url: params.url,
               authorId: author?.id
          },
          include: {
               comments: {
                    where: { parentId: null },
                    include: {
                         author: {
                              include: {
                                   Followers: true,
                                   Followings: true
                              }
                         },
                         replies: { include: { author: true, _count: { select: { replies: true, likes: true } } } },
                         _count: { select: { replies: true, likes: true } },
                         likes: true,
                    },
                    orderBy: {
                         createdAt: "desc"
                    }
               },
               likes: true,

               readedUsers: true,
               author: {
                    include: {
                         Followers: true,
                         Followings: true
                    }
               },
               tags: {
                    include: {
                         tag: true
                    }
               },
               savedUsers: true,
               _count: { select: { savedUsers: true, likes: true, comments: true } }
          }
     });

     if (!post) return notFound();

     const sessionUser = await getSessionUser()

     if (post?.authorId !== sessionUser?.id) {
          if (post?.visibility !== "public") return notFound();
     }

     const published = sessionUser?.id === post?.authorId && (
          searchParams.published === 'true' ? true : false
     )

     const cookkies = cookies()
     const hasViewed = cookkies.has(`post_views_${author?.username}_${post.url}`)

     if (!hasViewed) {
          await fetch(`${process.env.DOMAIN}/api/posts/${author?.username}/views/?url=${post.url}`, {
               method: "POST",
          });
     }
     if (sessionUser) {
          //check if the user has readed the post
          const hasReaded = await postgres.readingHistory.findFirst({
               where: {
                    postId: post?.id,
                    userId: sessionUser?.id
               }
          });
          if (!hasReaded) {
               await postgres.readingHistory.create({
                    data: {
                         postId: post?.id,
                         userId: sessionUser?.id
                    }
               });
          } else {
               await postgres.readingHistory.update({
                    where: {
                         id: hasReaded?.id
                    },
                    data: {
                         updatedAt: new Date(),
                         createdAt: new Date()
                    }
               });
          }
     }
     return (
          <>
               <Post post={post} author={author} sessionUser={sessionUser} tags={post.tags} comments={Boolean(commentsOpen)} published={published} />
          </>
     )
}