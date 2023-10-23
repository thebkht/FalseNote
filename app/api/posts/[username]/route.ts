import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

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
    const author = await postgres.user.findUnique({
      where: {
        username: username,
      }
    });
    const authorID = author?.id;

    const result = await postgres.post.findUnique({
      where: {
        url: postUrl,
        authorId: authorID,
      },
      include: {
        comments: true,
        tags: true,
        likes: true,
        savedUsers: true,
        author: {
          include: {
            _count: {
              select: {
                posts: true,
                Followers: true,
                Following: true,
              },
            },
            posts: {
              take: 4,
            },
          }
        },
      },
    })
    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // Return the user as JSON with status 200
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { username: string } }){
  const username = params.username;
  const postid = req.nextUrl.searchParams.get("postid");

  if (username === undefined || username === null) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (postid === undefined || postid === null) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    const author = await postgres.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });
    const authorID = author?.id;

    //check if the post belongs to the user
    const result = await postgres.post.findUnique({
      where: {
        id: Number(postid),
        authorId: authorID,
      },
    });
    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    //check if the post has comments and tags
    const comments = await postgres.comment.findMany({
      where: {
        postId: Number(postid),
      },
    });
    const tags = await postgres.postTag.findMany({
      where: {
        postId: Number(postid),
      },
    });
    const likes = await postgres.like.findMany({
      where: {
        postId: Number(postid),
      },
    });
    const saved = await postgres.bookmark.findMany({
      where: {
        postId: Number(postid),
      },
    });
    if (comments.length !== 0) {
      await postgres.comment.deleteMany({
        where: {
          postId: Number(postid),
        },
      });
    }
    if (tags.length !== 0) {
      await postgres.postTag.deleteMany({
        where: {
          postId: Number(postid),
        },
      });
    }
    if (likes.length !== 0) {
      await postgres.like.deleteMany({
        where: {
          postId: Number(postid),
        },
      });
    }
    if (saved.length !== 0) {
      await postgres.bookmark.deleteMany({
        where: {
          postId: Number(postid),
        },
      });
    }
    await postgres.post.delete({
      where: {
        id: Number(postid),
      },
    });
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}