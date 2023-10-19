import { sql } from '@/lib/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { username: string }}) {
  try {
    // Get the 'slug' route parameter from the request object
    const username = params.username;
    console.log(username);

    if (username === undefined || username === null) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Execute a query to fetch the specific user by name
    const result = await sql`
      select * from users where name = ${username} or username = ${username}
    `;

    const posts = await sql`
          SELECT * FROM BlogPosts WHERE AuthorID IN (SELECT userid WHERE Name = ${username} OR Username = ${username}) ORDER BY PostID DESC`;

    //execute a query to fetch the number of comments of the posts
    const postComments = await sql`
    SELECT BlogPostID, COUNT(*) AS commentsCount
    FROM Comments
    WHERE BlogPostID IN (
        SELECT PostID
        FROM BlogPosts
        WHERE AuthorID IN (SELECT userid WHERE Name = ${username} OR Username = ${username})
    )
    GROUP BY BlogPostID;
    `;
          
    posts.forEach((post: any) => {
      postComments.forEach((comment: any) => {
        if (post.postid === comment.blogpostid) {
          post.comments = comment.commentscount;
        }
      }
      )
    }
    )

    result[0].posts = posts;

    //Execute a query to fetch the all details of the user's followers
    const follower = await sql`
          SELECT * FROM users WHERE UserID IN (SELECT FollowerID FROM Follows WHERE FolloweeID= ${result[0]?.userid})`;    

    result[0].followers = follower;

    //Execute a query to fetch the all details of the user's following
    const following = await sql`
          SELECT * FROM users WHERE UserID IN (SELECT FolloweeID FROM Follows WHERE FollowerID= ${result[0]?.userid})`;

    result[0].following = following;

    if (result.length === 0 || username === undefined, username === null) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: result[0] }, { status: 200 });
  } catch (error) {
      
    return NextResponse.json({ error }, { status: 404 });
  }
}
