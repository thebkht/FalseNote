import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { username: string }}) {
  try {
    // Get the 'slug' route parameter from the request object
    const username = params.username;

    if (username === undefined || username === null) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Execute a query to fetch the specific user by name
    const result = await sql`
      SELECT * FROM users WHERE Name = ${username} OR Username = ${username}
    `;

    const posts = await sql`
          SELECT * FROM BlogPosts WHERE AuthorID= ${result.rows[0]?.userid} ORDER BY PostID DESC`;

    //execute a query to fetch the number of comments of the posts
    const postComments = await sql`
    SELECT BlogPostID, COUNT(*) AS commentsCount
    FROM Comments
    WHERE BlogPostID IN (
        SELECT PostID
        FROM BlogPosts
        WHERE AuthorID = ${result.rows[0]?.userid}
    )
    GROUP BY BlogPostID;
    `;

    console.log("posts comments", postComments);
          
    posts.rows.forEach((post: any) => {
      postComments.rows.forEach((comment: any) => {
        if (post.postid === comment.blogpostid) {
          post.comments = comment.commentscount;
        }
      }
      )
    }
    )

    result.rows[0].posts = posts.rows;

    //Execute a query to fetch the all details of the user's followers
    const follower = await sql`
          SELECT * FROM users WHERE UserID IN (SELECT FollowerID FROM Follows WHERE FolloweeID= ${result.rows[0]?.userid})`;    

    result.rows[0].followers = follower.rows;

    //Execute a query to fetch the all details of the user's following
    const following = await sql`
          SELECT * FROM users WHERE UserID IN (SELECT FolloweeID FROM Follows WHERE FollowerID= ${result.rows[0]?.userid})`;

    result.rows[0].following = following.rows;

    console.log("Query result:", result)

    if (result.rowCount === 0 || result.rows.length === 0 || username === undefined, username === null) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: result.rows[0] }, { status: 200 });
  } catch (error) {
      
    return NextResponse.json({ error }, { status: 404 });
  }
}
