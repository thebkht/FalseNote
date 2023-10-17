import FeedPostCard from "@/components/blog/feed-post-card";
import { formatNumberWithSuffix } from "@/components/format-numbers";
import { getSessionUser } from "@/components/get-session-user";
import TagDetails from "@/components/tags/details";
import TagPosts from "@/components/tags/post";
import { Button } from "@/components/ui/button";
import { sql } from "@/lib/postgres";
import { ta } from "date-fns/locale";
import { Tag } from "lucide-react";
import { redirect } from "next/navigation";

export default async function TagPage({ params }: { params: { tagname: string } }) {
     const { rows: tagData } = await sql(`SELECT * FROM tags WHERE tagname = ${params.tagname}`);
     const tag = tagData[0];
     if (!tag) redirect("/404");
     const { rows: posts } = await sql(`SELECT * FROM blogposts WHERE postid IN (SELECT blogpostid FROM blogposttags WHERE tagid = ${tag.tagid})`);
     const { rows: postAuthors } = await sql(`SELECT * FROM users WHERE userid IN (SELECT authorid FROM blogposts WHERE postid IN (SELECT blogpostid FROM blogposttags WHERE tagid = ${tag.tagid}))`);
     posts.forEach((post: any) => {
          postAuthors.forEach((author: any) => {
               if (author.userid === post.authorid) {
                    post.author = author;
               }
          }
          )
     }
     )
     const session = await getSessionUser();

     const { rows: tagFollowers } = await sql(`SELECT * FROM tagfollows WHERE tagid = ${tag.tagid}`);
     tag.followers = tagFollowers;
     //if session, check if user is following tag
     if (session) {
          tagFollowers.find((follower: any) => {
               if (follower.userid === session.userid) {
                    tag.isFollowing = true;
               } else {
                    tag.isFollowing = false;
               }
          }
          )
     } else {
          tag.isFollowing = false;
     }
     const { rows: postComments } = await sql(`SELECT * FROM comments WHERE blogpostid IN (SELECT postid FROM blogposts WHERE postid IN (SELECT blogpostid FROM blogposttags WHERE tagid = ${tag.tagid}))`);
     posts.forEach((post: any) => {
          postComments.forEach((comment: any) => {
               if (comment.postid === post.postid) {
                    post.comments = post.comments + 1;
               }
          }
          )
     }
     )

     console.log(tag);
     <div className=""></div>
     return (
          <>
               <div className="flex flex-col space-y-6">
                    <TagDetails tag={tag} post={posts.length} tagFollowers={tag.followers} />
                    <TagPosts posts={posts} tag={tag} session={session} />
               </div>
          </>
     )
}