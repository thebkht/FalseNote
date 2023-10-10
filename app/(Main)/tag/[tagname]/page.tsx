import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";

export default async function TagPage({ tagname }: {tagname: string}) {
     const { rows: tagData } = await sql`SELECT * FROM tags WHERE tagname = ${tagname}`;
     const tag = tagData[0];
     if (!tag) redirect("/404");
     const { rows: posts } = await sql`SELECT * FROM blogposts WHERE postid IN (SELECT blogpostid FROM blogposttags WHERE tagid = ${tag.tagid})`;
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
     const { rows: tags } = await sql`SELECT * FROM tags`;
     //add href to tags
     tags.forEach((tag: any) => {
          tag.href = `/tag/${tag.tagname}`;
     }
     )

}