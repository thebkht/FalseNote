import { sql } from "@/lib/postgres";
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
    const author = await sql('SELECT * FROM Users WHERE Username = $1', [username]);
    const authorID = author[0]?.userid;
    //Get author's posts
    const authorPosts = await sql('SELECT * FROM BlogPosts WHERE AuthorID = $1 AND url = $2 ORDER BY PostID DESC LIMIT 4', [authorID, postUrl])
    author[0].posts = authorPosts;

    const authorPostsComments = await sql('SELECT * FROM Comments WHERE BlogPostID IN (WHERE AuthorID = $1 AND url = $2 LIMIT 4)', [authorID, postUrl])

      console.log(authorPostsComments);
    authorPosts.forEach((post: any) => {
      const comments = authorPostsComments.filter(
        (comment: any) => comment.blogpostid === post.postid
      );
      post.comments = comments.length;
    }
    );

    // Get author's followers
    const followers = await sql('SELECT * FROM Users WHERE UserID IN (SELECT FollowerID FROM Follows WHERE FolloweeID = $1)', [authorID])
    author[0].followers = followers;

    const result = await sql('SELECT * FROM BlogPosts WHERE Url = $1 AND authorid = $2', [postUrl, authorID]);
    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    result[0].author = author[0];

    const comments = await sql('SELECT * FROM Comments WHERE BlogPostID = $1', [result[0]?.postid])
    result[0].comments = comments;

    const commentsAuthors = await sql('SELECT * FROM Users WHERE UserID IN (SELECT AuthorID FROM Comments WHERE BlogPostID = $1)', [result[0]?.postid])
    
    comments.forEach((comment: any) => {
      const author = commentsAuthors.find((author: any) => author.userid === comment.authorid);
      comment.author = author;
    }
    );

    result[0].commentsNum = comments.length;
    const tags = await sql('SELECT * FROM Tags WHERE TagID IN (SELECT TagID FROM PostTags WHERE PostID = $1)', [result[0]?.postid]);
    result[0].tags = tags;

    console.log("Query result:", result);
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
    const author = await sql('SELECT * FROM Users WHERE Username = $1', [username])
    const authorID = author[0]?.userid;

    //check if the post belongs to the user
    const result = await sql('SELECT * FROM BlogPosts WHERE PostID = $1 AND AuthorID = $2', [postid, authorID]);
    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    //check if the post has comments and tags
    const comments = await sql('SELECT * FROM Comments WHERE BlogPostID = $1', [postid])
    const tags = await sql('SELECT * FROM BlogPostTags WHERE BlogPostID = $1', [postid])
    if (comments.length !== 0) {
      await sql('DELETE FROM Comments WHERE BlogPostID = $1', [postid])
    }
    if (tags.length !== 0) {
      await sql('DELETE FROM BlogPostTags WHERE BlogPostID = $1', [postid])
    }
    await sql('DELETE FROM BlogPosts WHERE PostID = $1', [postid])
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}