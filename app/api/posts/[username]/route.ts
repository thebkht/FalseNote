import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { remark } from "remark";
import html from "remark-html";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    // Get the 'slug' route parameter from the request object
    const username = params.username;
    const postUrl = req.nextUrl.searchParams.get("url");

    if (username === undefined || username === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (postUrl === undefined || postUrl === null) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // Execute a query to fetch the specific user by name
    const author = await sql`
       SELECT * FROM users WHERE Username = ${username}
     `;
    const authorID = author.rows[0]?.userid;
    //Get author's posts
    const authorPosts = await sql`
        SELECT * FROM BlogPosts WHERE AuthorID = ${authorID}
      `;
    author.rows[0].posts = authorPosts.rows;

    // Get author's followers
    const followers = await sql`
        SELECT * FROM Follows WHERE FolloweeID = ${authorID}
      `;
    author.rows[0].followers = followers.rows;

    const result = await sql`
       SELECT * FROM BlogPosts WHERE AuthorID = ${authorID} AND Url = ${postUrl}
     `;

    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(html).process(result.rows[0].content);
    const contentHtml = processedContent.toString();

    result.rows[0].content = contentHtml;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    result.rows[0].author = author.rows[0];

    const comments = await sql`
           SELECT * FROM Comments WHERE BlogPostID= ${result.rows[0]?.postid}`;
    result.rows[0].comments = comments.rows;

    const commentsNum = await sql`
            SELECT COUNT(*) FROM Comments WHERE BlogPostID= ${result.rows[0]?.postid}`;
    result.rows[0].commentsNum = commentsNum.rows[0].count;
    const tags = await sql`
               SELECT * FROM Tags WHERE TagID IN (SELECT TagID FROM BlogPostTags WHERE BlogPostID = ${result.rows[0]?.postid})`;
    result.rows[0].tags = tags.rows;

    console.log("Query result:", result);
    // Return the user as JSON with status 200
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
