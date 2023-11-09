'use server'
import { getSessionUser } from "@/components/get-session-user"
import { redirect, useRouter } from "next/navigation"
import postgres from "@/lib/postgres"
import Post from "@/components/blog/post"
import PostComment from "@/components/blog/comment"
import MoreFromAuthor from "@/components/blog/more-from-author"
import { cookies } from 'next/headers'
import { Separator } from "@/components/ui/separator"
import RelatedPosts from "@/components/blog/related-posts"
import readingTime from 'reading-time';

export default async function PostView({ params, searchParams }: { params: { username: string, url: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
     const commentsOpen = typeof searchParams.commentsOpen === 'string' ? searchParams.commentsOpen : undefined
     
     console.log(commentsOpen);
     const author = await postgres.user.findFirst({
          where: {
               username: params.username
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
                    include: {
                         author: {
                              include: {
                                   Followers: true,
                                   Followings: true
                              }
                         },
                         replies: {
                              include:{
                                   parent: {
                                        include: {
                                             
                                        }
                                   }
                              }
                         },
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

     if (!post) redirect("/404");

     const sessionUser = await getSessionUser()

     if (post?.authorId !== sessionUser?.id) {
          if (post?.visibility !== "public") redirect("/404");
     }

     const cookkies = cookies()
     const hasViewed = cookkies.has(`post_views_${author?.username}_${post.url}`)

     if (!hasViewed) {
          await fetch(`${process.env.DOMAIN}/api/posts/${author?.username}/views/?url=${post.url}`, {
          method: "POST",
     });
     }
     if(sessionUser) {
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

     //fetch related posts according to tags and dont include the current post
     //fetch the first 4 posts

     return (
          <>
               <Post post={post} author={author} sessionUser={sessionUser} tags={post.tags} comments={Boolean(commentsOpen)} />
          </>
     )
}