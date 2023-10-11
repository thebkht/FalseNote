import FeedPostCard from "@/components/blog/feed-post-card";
import { formatNumberWithSuffix } from "@/components/format-numbers";
import { getSessionUser } from "@/components/get-session-user";
import TagPosts from "@/components/tags/post";
import { Button } from "@/components/ui/button";
import { sql } from "@vercel/postgres";
import { Tag } from "lucide-react";
import { redirect } from "next/navigation";

export default async function TagPage({ params }: { params: { tagname: string } }) {
     const { rows: tagData } = await sql`SELECT * FROM tags WHERE tagname = ${params.tagname}`;
     const tag = tagData[0];
     if (!tag) redirect("/404");
     const { rows: posts } = await sql`SELECT * FROM blogposts WHERE postid IN (SELECT blogpostid FROM blogposttags WHERE tagid = ${tag.tagid})`;
     const { rows: postAuthors } = await sql`SELECT * FROM users WHERE userid IN (SELECT authorid FROM blogposts WHERE postid IN (SELECT blogpostid FROM blogposttags WHERE tagid = ${tag.tagid}))`;
     posts.forEach((post: any) => {
          postAuthors.forEach((author: any) => {
               if (author.userid === post.authorid) {
                    post.author = author;
               }
          }
          )
     }
     )
     const { rows: postComments } = await sql`SELECT * FROM comments WHERE blogpostid IN (SELECT postid FROM blogposts WHERE postid IN (SELECT blogpostid FROM blogposttags WHERE tagid = ${tag.tagid}))`;
     posts.forEach((post: any) => {
          postComments.forEach((comment: any) => {
               if (comment.postid === post.postid) {
                    post.comments = post.comments + 1;
               }
          }
          )
     }
     )

     const session = await getSessionUser();
     return (
          <>
               <div className="flex flex-col space-y-6">
                    <div className="space-y-0.5 px-6 pb-14 w-full">
                         <h2 className="text-5xl font-medium tracking-tight w-full capitalize text-center">{tag.tagname}</h2>
                         <div className="text-muted-foreground pt-4 pb-6 flex justify-center">
                              Tag<div className="mx-2">·</div>{formatNumberWithSuffix(posts.length)} Posts<div className="mx-2">·</div>{formatNumberWithSuffix(tag.followers)} Followers
                         </div>
                         <div className="w-full flex justify-center">
                              <Button variant={"secondary"} size={"lg"}>Follow</Button>
                         </div>
                    </div>
                    <TagPosts posts={posts} tag={tag} session={session} />
               </div>
          </>
     )
}