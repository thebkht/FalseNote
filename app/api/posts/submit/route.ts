import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres"

export async function POST(req: NextRequest) {
     try {
          const data = await req.json();
          if (!data) {
               return new Response("No data provided", { status: 400 });
          }
          console.log("Received data:", data);

          const { title, content, coverImage, visibility, topics, url, authorId } = data;

          if (!title || !content || !visibility || !topics || !url || !authorId) {
               return new Response("Missing required fields", { status: 400 });
          }

          var isDraft;
          if (visibility === "Draft") {
               isDraft = true;
          } else {
               isDraft = false;
          }

          await sql`
          INSERT INTO BlogPosts (Title, Content, CoverImage, Visibility, Draft, url, AuthorID)
          VALUES (${title}, ${content}, ${coverImage}, ${visibility}, ${isDraft}, ${url}, ${authorId})
          `;

          return NextResponse.json({ body: "Post submitted" }, { status: 200 });

     } catch (error) {
          console.error("Error:", error);
          return NextResponse.json({body: "Error processing data"},
            {status: 500});
        }
        return NextResponse.json({body: "Unsupported method"}, {status: 405});
      }
     