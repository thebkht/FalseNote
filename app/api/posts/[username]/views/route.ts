import { sql } from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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

     // Check if the view has already been counted by looking for a cookie
    const cookieName = `post_views_${username}_${postUrl}`;
    const hasViewed = req.cookies.get(cookieName);

     if (!hasViewed) {
      // Execute a query to fetch the specific userid by name
      const author = await sql('SELECT * FROM Users WHERE Username = $1', [username]);
      const authorID = author[0]?.userid;

      await sql('UPDATE BlogPosts SET Views = Views + 1 WHERE Url = $1 AND AuthorID = $2', [postUrl, authorID]);

      // Set a cookie to indicate that the post has been viewed
      req.cookies.set(cookieName, "true",)
    }
    
    return NextResponse.json({ message: "View added" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
