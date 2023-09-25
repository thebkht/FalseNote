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

    const followerCount = await sql`
          SELECT COUNT(*) AS followerCount FROM Follows WHERE FolloweeID= ${result.rows[0]?.userid}`;
    
    const followingCount = await sql`
          SELECT COUNT(*) AS followingCount FROM Follows WHERE FollowerID= ${result.rows[0]?.userid}`;

    
    result.rows[0].followersnum = followerCount.rows[0]?.followercount;
    result.rows[0].followingnum = followingCount.rows[0]?.followingcount;

    const posts = await sql`
          SELECT * FROM BlogPosts WHERE AuthorID= ${result.rows[0]?.userid}`;

    result.rows[0].posts = posts.rows;

    const postsCount = await sql`
          SELECT COUNT(*) AS postsCount FROM BlogPosts WHERE AuthorID= ${result.rows[0]?.userid}`;

      result.rows[0].postsnum = postsCount.rows[0]?.postscount;

    const comments = await sql`
          SELECT * FROM Comments WHERE AuthorID= ${result.rows[0]?.userid}`;

    result.rows[0].comments = comments.rows;

    const followers = await sql`
          SELECT Followeeid FROM Follows WHERE FolloweeID= ${result.rows[0]?.userid}`;

    result.rows[0].followers = followers.rows;

    const following = await sql`
          SELECT Followeeid FROM Follows WHERE FollowerID= ${result.rows[0]?.userid}`;

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
