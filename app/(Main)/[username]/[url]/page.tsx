//Post view page for a specific user (username) and post (url)
// Path: app/%28Main%29/%5Busername%5D/%5Burl%5D/page.tsx
// Compare this snippet from components/feed/feed.tsx:
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import React, { use, useEffect, useState } from "react"
import {
     HoverCard,
     HoverCardContent,
     HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CalendarDays, Check, User } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getSessionUser } from "@/components/get-session-user"
import { useSession } from "next-auth/react"
import { Icons } from "@/components/icon"
import { Separator } from "@/components/ui/separator"
import { redirect, useRouter } from "next/navigation"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import PostCard from "@/components/blog/post-card"
import { formatNumberWithSuffix } from "@/components/format-numbers"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import CommentForm from "@/components/blog/comments/comment-form"
import LoginDialog from "@/components/login-dialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import UserHoverCard from "@/components/user-hover-card"
import { sql } from "@vercel/postgres"
import { remark } from "remark";
import html from "remark-html";
import Post from "@/components/blog/post"
import PostComment from "@/components/blog/comment"
import MoreFromAuthor from "@/components/blog/more-from-author"

export default async function PostView({ params }: { params: { username: string, url: string } }) {
     const { rows: authorData } = await sql`SELECT * FROM users WHERE username = ${params.username}`;
     const author = authorData[0];
     
     const { rows: authorPosts } = await sql`SELECT * FROM blogposts WHERE authorid = ${author.userid} AND url != ${params.url} ORDER BY PostID DESC LIMIT 4`;
     const { rows: authorPostsComments } = await sql`SELECT * FROM comments WHERE blogpostid IN (SELECT postid FROM blogposts WHERE authorid = ${author.userid} AND visibility = 'public' AND url != ${params.url})`;
     authorPosts.forEach((post: any) => {
          authorPostsComments.forEach((comment: any) => {
               if (comment.postid === post.postid) {
                    post.comments = post.comments + 1;
               }
          }
          )
     }
     )
     const { rows: auhorFollowers } = await sql`SELECT * FROM users WHERE userid IN (SELECT followerid FROM follows WHERE followeeid = ${author.userid})`;
     author.followers = auhorFollowers.length;
     const { rows: postData } = await sql`SELECT * FROM blogposts WHERE authorid = ${author?.userid} AND url = ${params.url}`;
     const post = postData[0];
     if (!post) redirect("/404");
     // const processedContent = await remark().use(html).process(post.content);
     // post.content = processedContent.toString();
     const { rows: postComments } = await sql`SELECT * FROM comments WHERE blogpostid = ${post.postid}`;
     const { rows: postCommentsAuthor } = await sql`SELECT * FROM users WHERE userid IN (SELECT authorid FROM comments WHERE blogpostid = ${post.postid})`;
     postComments.forEach((comment: any) => {
          postCommentsAuthor.forEach((author: any) => {
               if (comment.authorid === author.userid) {
                    comment.author = author;
               }
          }
          )
     }
     )
     const { rows: postTags } = await sql`SELECT * FROM tags WHERE tagid IN (SELECT tagid FROM blogposttags WHERE blogpostid = ${post.postid})`;
     console.log(postTags);

     const sessionUser = await getSessionUser()


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
               <Post post={post} author={author} sessionUser={sessionUser} tags={postTags} />
               <PostComment comments={postComments} post={post} postAuthor={author} />
               <MoreFromAuthor post={authorPosts} author={author} sessionUser={sessionUser} />
          </>
     )
}