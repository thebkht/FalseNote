import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest, { params }: { params: { username: string }}
) {
     try {
     // Get the 'slug' route parameter from the request object
     const username = params.username;
     const postUrl = req.nextUrl.searchParams.get("url");

     if (username === undefined || username === null) {
       return NextResponse.json({ error: 'User not found' }, { status: 404 });
     }
     if (postUrl === undefined || postUrl === null) {
           return NextResponse.json({ error: 'Post not found' }, { status: 404 });
     }
     // Execute a query to fetch the specific user by name
     const author = await sql`
       SELECT * FROM users WHERE Username = ${username}
     `;
     const authorID = author.rows[0]?.userid;
     const result = await sql`
       SELECT * FROM BlogPosts WHERE AuthorID = ${authorID} AND Url = ${postUrl}
     `;

     if (result.rows.length === 0) {
       return NextResponse.json({ error: 'Post not found' }, { status: 404 });
     }

     result.rows[0].author = author.rows[0];

     const comments = await sql`
           SELECT * FROM Comments WHERE BlogPostID= ${result.rows[0]?.postid}`;
     result.rows[0].comments = comments.rows;
     const tags = await sql`
               SELECT * FROM BlogPostTags WHERE BlogPostID= ${result.rows[0]?.postid}`;
     tags.rows.map(async (tagConnection: any, index: number) => {
               const tag = await sql`
                         SELECT * FROM Tags WHERE TagID= ${tagConnection.tagid}`;
               tags.rows[index].tag = tag.rows[0];
     }
     );
     result.rows[0].tags = tags.rows.map((tagConnection: any) => tagConnection.tag);

     console.log("Query result:", result)
     // Return the user as JSON with status 200
     return NextResponse.json(result.rows[0], { status: 200 });
     } catch (error) {
          console.log(error);
          return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
     }
     }