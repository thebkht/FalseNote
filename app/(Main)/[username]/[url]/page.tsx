'use server'
import { getSessionUser } from "@/components/get-session-user"
import { redirect, useRouter } from "next/navigation"
import postgres from "@/lib/postgres"
import Post from "@/components/blog/post"
import PostComment from "@/components/blog/comment"
import MoreFromAuthor from "@/components/blog/more-from-author"
import { cookies } from 'next/headers'
import { incrementPostViews } from "@/components/blog/actions"


export default async function PostView({ params }: { params: { username: string, url: string } }) {
     const author = await postgres.user.findFirst({
          where: {
               username: params.username
               },
          include: {
               posts: {
                    where: {
                         visibility: 'public',
                         url: {
                              not: params.url
                         }
                    },
                    include: {
                         _count: { select: { comments: true, savedUsers: true, likes: true } },
                         author: {
                              include: {
                                   Followers: true,
                                   Followings: true
                              }
                         },
                    },
                    orderBy: {
                         createdAt: "desc"
                    },
                    take: 4
               },
               _count: { select: { posts: true, Followers: true, Followings: true } },
               Followers: true,
               Followings: true
          }
               });
     
     const authorPosts = author?.posts;
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
                         }
                    }
               },
               likes: true,
               tags: {
                    include: {
                         tag: true
                    }
               },
               author: {
                    include: {
                         Followers: true,
                         Followings: true
                    }
               },
               _count: { select: { savedUsers: true, likes: true, comments: true } }
          }
     });
     if (!post) redirect("/404");
     console.log(post);

     const sessionUser = await getSessionUser()

     if (post?.authorId !== sessionUser?.id) {
          if (post?.visibility !== "public") redirect("/404");
     }

     

     await fetch(`${process.env.DOMAIN}/api/posts/${author?.username}/views/?url=${post.url}`, {
          method: "POST",
     });

     return (
          <>
               <Post post={post} author={author} sessionUser={sessionUser} tags={post.tags} />
               <PostComment comments={post.comments} post={post} postAuthor={author} />
               <MoreFromAuthor post={authorPosts} author={author} sessionUser={sessionUser} />
          </>
     )
}