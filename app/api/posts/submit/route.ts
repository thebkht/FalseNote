import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/postgres"
import { sq } from "date-fns/locale";

async function insertTag(tags: any, postid: any) {
     if (tags) {
          for (const tag of tags) {
               // Check if tag exists
               const tagExists = await sql('SELECT * FROM tags WHERE TagName = $1', [tag.value])
               if (tagExists.length === 0) {
                    // Insert tag into tags table
                    // await sql`
                    // INSERT INTO tags (TagName)
                    // VALUES (${tag.value})
                    // `;
                    await sql('INSERT INTO tags (TagName) VALUES ($1)', [tag.value]);
               }
               const tagId = await sql('SELECT TagID FROM tags WHERE TagName = $1', [tag.value])
               const tagIdInt = tagId?.[0].tagid;
               // await sql`
               // INSERT INTO BlogPostTags (BlogPostID, TagID)
               // VALUES (${postid}, ${tagIdInt})
               // `;
               await sql('INSERT INTO BlogPostTags (BlogPostID, TagID) VALUES ($1, $2)', [postid, tagIdInt]);
          }
     }
}

export async function POST(req: NextRequest) {
     try {
          const data = await req.json();
          if (!data) {
               return new Response("No data provided", { status: 400 });
          }
          console.log("Received data:", data);

          //if req url is /api/posts/submit then add new post to database
          //if req url is /api/posts/submit?postid then update post in database
          const postid = req.nextUrl.searchParams.get("postId");

          const { title, content, coverImage, visibility, tags, url, authorId, description } = data;

          if (!title) {
               return new Response("No title provided", { status: 400 });
          }
          if (!content) {
               return new Response("No content provided", { status: 400 });
          }

          if (!authorId) {
               return new Response("No author provided", { status: 400 });
          }

          if (!url) {
               return new Response("No url provided", { status: 400 });
          }

          var isDraft;
          if (visibility === "Draft") {
               isDraft = true;
          } else {
               isDraft = false;
          }

          if (postid) {
               //first check if post exists in database
               //check is there any changes to the post
               //if there are changes then update the post
               //if there are no changes then do nothing
               const post = await sql('SELECT * FROM BlogPosts WHERE PostID = $1', [postid])
               const postData = post?.[0];
               if (!postData) {
                    return new Response("Post does not exist", { status: 400 });
               }
               
               if (title !== postData.title || content !== postData.content || coverImage !== postData.coverimage || visibility !== postData.visibility || isDraft !== postData.draft || url !== postData.url || description !== postData.description) {
                    // await sql`
                    // UPDATE BlogPosts
                    // SET Title = ${title}, Content = ${content}, CoverImage = ${coverImage}, Visibility = ${visibility}, Draft = ${isDraft}, url = ${url}, Description = ${description}, Lastupdateddate = NOW()
                    // WHERE PostID = ${postid}
                    // `;
                    await sql('UPDATE BlogPosts SET Title = $1, Content = $2, CoverImage = $3, Visibility = $4, Draft = $5, url = $6, Description = $7, Lastupdateddate = NOW() WHERE PostID = $8', [title, content, coverImage, visibility, isDraft, url, description, postid]);

                    //update tags
                    //first delete all tags associated with the post
               }
               const postTags = await sql('SELECT * FROM BlogPostTags WHERE BlogPostID = $1', [postid])
               const postTagsData = postTags;
               if (postTagsData) {
                    // await sql`
                    //      DELETE FROM BlogPostTags WHERE BlogPostID = ${postid}
                    //      `;
                    await sql('DELETE FROM BlogPostTags WHERE BlogPostID = $1', [postid]);
               }
               await insertTag(tags, postid);
               

               return NextResponse.json({ body: "Post updated" });
          }
          else {

          // await sql`
          // INSERT INTO BlogPosts (Title, Content, CoverImage, Visibility, Draft, url, AuthorID, Description)
          // VALUES (${title}, ${content}, ${coverImage}, ${visibility}, ${isDraft}, ${url}, ${authorId}, ${description})
          // `;
          await sql('INSERT INTO BlogPosts (Title, Content, CoverImage, Visibility, Draft, url, AuthorID, Description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [title, content, coverImage, visibility, isDraft, url, authorId, description]);

          const submittedPostId = await sql('SELECT PostID FROM BlogPosts WHERE url = $1 AND authodid = $2', [url, authorId])

          const postId = submittedPostId?.[0].postid;

          await insertTag(tags, postId);

          return NextResponse.json({ body: "Post submitted" });
          }    
     } catch (error) {
          console.error("Error:", error);
          return NextResponse.json({body: "Error processing data"},
            {status: 500});
        }
      }
     