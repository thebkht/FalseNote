import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres"

export async function POST(req: NextRequest) {
     try {
          const data = await req.json();
          if (!data) {
               return new Response("No data provided", { status: 400 });
          }
          console.log("Received data:", data);

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

          const postId = submittedPostId.rows?.[0].postid;

          if (tags) {
               for (const tag of tags) {
                    await sql`
                    INSERT INTO Tags (TagName)
                    VALUES (${tag})
                    `;
               }
          }
          
          if (tags) {
               for (const tag of tags) {
                    const tagId = await sql`
                    SELECT TagID FROM tags WHERE TagName = ${tag}
                    `;
                    const tagIdInt = tagId.rows?.[0].tagid;
                    await sql`
                    INSERT INTO BlogPostTags (BlogPostID, TagID)
                    VALUES (${postId}, ${tagIdInt})
                    `;
               }
          }

          return new Response("Post submitted", { status: 200 });
     } catch (error) {
          console.error("Error:", error);
          return NextResponse.json({body: "Error processing data"},
            {status: 500});
        }
        return NextResponse.json({body: "Unsupported method"}, {status: 405});
      }
     