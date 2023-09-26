import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

// api to execute the top users query by followers and return the result
export async function GET(request: Request) {
  try {
    // Execute a query to fetch all users
    const users = await sql`SELECT * FROM Users`;

    // Create an array of promises for fetching followers
    const followersPromises = users.rows.map(async (user: any) => {
      const followers = await sql`SELECT * FROM Follows WHERE FolloweeID = ${user.userid}`;
      user.followers = followers.rows;
    });

    // Wait for all follower queries to complete
    await Promise.all(followersPromises);

    // Sort the users by followers
    users.rows.sort((a: any, b: any) => {
      return b.followers.length - a.followers.length;
    });

    // Return the top 10 users
    return NextResponse.json(users.rows.slice(0, 10));
  } catch (error) {
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}
