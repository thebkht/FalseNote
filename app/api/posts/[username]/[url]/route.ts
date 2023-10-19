import { sql } from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string, url: string } }
) {
  try {
    // Get the 'slug' route parameter from the request object
    const username = params.username;
    const postUrl = params.url;

    if (username === undefined || username === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (postUrl === undefined || postUrl === null) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // Execute a query to fetch the specific user by name
    const author = await sql('SELECT * FROM Users WHERE Username = $1', [username]);
    const authorID = author[0]?.userid;
    //Get author's posts
    const authorPosts = await sql('SELECT * FROM BlogPosts WHERE AuthorID = $1', [authorID])
    author[0].posts = authorPosts;

    // Get author's followers
    const followers = await sql('SELECT * FROM Users WHERE UserID IN (SELECT FollowerID FROM Follows WHERE FolloweeID = $1)', [authorID])
    author[0].followers = followers;

    const result = await sql('SELECT * FROM BlogPosts WHERE Url = $1 AND authorid = $2', [postUrl, authorID]);

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    result[0].author = author[0];

    const comments = await sql('SELECT * FROM Comments WHERE BlogPostID = $1', [result[0]?.postid])
    result[0].comments = comments;

    result[0].commentsNum = comments.length;
    const tags = await sql('SELECT * FROM Tags WHERE TagID IN (SELECT TagID FROM PostTags WHERE PostID = $1)', [result[0]?.postid]);
    result[0].tags = tags;

    // Return the user as JSON with status 200
    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
