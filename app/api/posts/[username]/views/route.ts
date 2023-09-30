import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { remark } from "remark";
import html from "remark-html";

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
     // Execute a query to fetch the specific userid by name
     const author = await sql`
     SELECT * FROM users WHERE Username = ${username}
     `;
     const authorID = author.rows[0]?.userid;

    await sql`UPDATE blogposts SET views = views + 1 WHERE authorid = ${authorID} AND url = ${postUrl}`
    
    return NextResponse.json({ message: "View added" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
