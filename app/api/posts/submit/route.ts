import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres"
import { redirect } from "next/navigation";

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

          if (postid) {
               //first check if post exists in database
               //check is there any changes to the post
               //if there are changes then update the post
               //if there are no changes then do nothing
               const post = await sql`
               SELECT * FROM BlogPosts WHERE PostID = ${postid}
               `;
               const postData = post.rows?.[0];
               if (!postData) {
                    return new Response("Post does not exist", { status: 400 });
               }
               const { title, content, coverImage, visibility, tags, url, description } = data;
               if (!title) {
                    return new Response("No title provided", { status: 400 });
               }
               if (!content) {
                    return new Response("No content provided", { status: 400 });
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
               if (title !== postData.title || content !== postData.content || coverImage !== postData.coverimage || visibility !== postData.visibility || isDraft !== postData.draft || url !== postData.url || description !== postData.description) {
                    await sql`
                    UPDATE BlogPosts
                    SET Title = ${title}, Content = ${content}, CoverImage = ${coverImage}, Visibility = ${visibility}, Draft = ${isDraft}, url = ${url}, Description = ${description}, Lastupdateddate = NOW()
                    WHERE PostID = ${postid}
                    `;

                    //update tags
                    //first delete all tags associated with the post
                    await sql`
                    DELETE FROM BlogPostTags WHERE BlogPostID = ${postid}
                    `;
                    //then add new tags
                    if (tags) {
                         for (const tag of tags) {
                              // Check if tag exists
                              const tagExists = await sql`
                              SELECT * FROM tags WHERE TagName = ${tag.value}
                              `;
                              if (tagExists.rows.length === 0) {
                                   // Insert tag into tags table
                                   await sql`
                                   INSERT INTO tags (TagName)
                                   VALUES (${tag.value})
                                   `;
                              }
                              const tagId = await sql`
                              SELECT TagID FROM tags WHERE TagName = ${tag.value}
                              `;
                              const tagIdInt = tagId.rows?.[0].tagid;
                              await sql`
                              INSERT INTO BlogPostTags (BlogPostID, TagID)
                              VALUES (${postid}, ${tagIdInt})
                              `;
                         }
                    }
               }

               return NextResponse.json({ body: "Post updated" });
          }
          else {
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

          await sql`
          INSERT INTO BlogPosts (Title, Content, CoverImage, Visibility, Draft, url, AuthorID, Description)
          VALUES (${title}, ${content}, ${coverImage}, ${visibility}, ${isDraft}, ${url}, ${authorId}, ${description})
          `;

          const submittedPostId = await sql`
          SELECT PostID FROM BlogPosts WHERE url = ${url}
          `;

          const user = await sql`
          SELECT username FROM Users WHERE UserID = ${authorId}
          `;

          const username = user.rows?.[0];

          const postId = submittedPostId.rows?.[0].postid;

          if (tags) {
               for (const tag of tags) {
                    // Check if tag exists
                    const tagExists = await sql`
                    SELECT * FROM tags WHERE TagName = ${tag.value}
                    `;
                    if (tagExists.rows.length === 0) {
                         // Insert tag into tags table
                         await sql`
                         INSERT INTO tags (TagName)
                         VALUES (${tag.value})
                         `;
                    }

const tagId = await sql`
                    SELECT TagID FROM tags WHERE TagName = ${tag.value}
                    `;
                    const tagIdInt = tagId.rows?.[0].tagid;
                    await sql`
                    INSERT INTO BlogPostTags (BlogPostID, TagID)
                    VALUES (${postId}, ${tagIdInt})
                    `;
               }
          }

          return NextResponse.json({ body: "Post submitted" });
          }    
     } catch (error) {
          console.error("Error:", error);
          return NextResponse.json({body: "Error processing data"},
            {status: 500});
        }
      }
     