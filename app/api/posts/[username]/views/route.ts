import { incrementPostViews } from "@/components/blog/actions";
import { getSessionUser } from "@/components/get-session-user";
import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    // Get the 'slug' route parameter from the request object
    const username = params.username;
    const postUrl = req.nextUrl.searchParams.get("url");
    const session = await getSessionUser()

    if (username === undefined || username === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (postUrl === undefined || postUrl === null) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const cookie = await incrementPostViews({ author: username, post: postUrl });

    req.cookies.set(cookie.name, cookie.value);

    const post = await postgres.post.findUnique({
      where: {
        url: postUrl,
        author: {
          username,
        }
      },
      select: {
        id: true,
      }
    });
    
    return NextResponse.json({ message: "View added" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
