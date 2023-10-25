
import React, { use, useEffect, useState } from "react"
import { getSessionUser } from "@/components/get-session-user"
import { redirect, useRouter } from "next/navigation"
import postgres from "@/lib/postgres"
import Post from "@/components/blog/post"
import PostComment from "@/components/blog/comment"
import MoreFromAuthor from "@/components/blog/more-from-author"


export default async function PostView({ params }: { params: { username: string, url: string } }) {
     const author = await postgres.user.findFirst({
          where: {
               username: params.username
               },
          include: {
               posts: {
                    where: {
                         visibility: 'public'
                    },
                    include: {
                         _count: { select: { comments: true } }
                    }
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
               _count: { select: { savedUsers: true, likes: true } }
          }
     });
     if (!post) redirect("/404");
     console.log(post);

     const sessionUser = await getSessionUser()

     if (post?.authorId !== sessionUser?.userid) {
          if (post?.visibility !== "public") redirect("/404");
     }

     // async function handleFollow(followeeId: string) {
     //      if (status === "authenticated") {
     //           setIsFollowingLoading(true);
     //           try {
     //                const followerId = (await getSessionUser()).userid;
     //                await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
     //                     method: "GET",
     //                });
     //           } catch (error) {
     //                console.error(error);
     //           }
     //      } else {
     //           return null;
     //      }

     // }

     // if (!isLoaded || !post) {
     //      return (
     //           <div className="w-full max-h-screen flex justify-center items-center bg-background" style={
     //                {
     //                  minHeight: "calc(100vh - 192px)"
     //                }
     //              }>
     //                 <Icons.spinner className="h-10 animate-spin" />
     //               </div>
     //      )
     // }

     return (
          <>
               <Post post={post} author={author} sessionUser={sessionUser} tags={post.tags} />
               <PostComment comments={post.comments} post={post} postAuthor={author} />
               <MoreFromAuthor post={authorPosts} author={author} sessionUser={sessionUser} />
          </>
     )
}