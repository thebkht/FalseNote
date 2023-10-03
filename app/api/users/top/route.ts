import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

// api to execute the top users query by followers and return the result
export async function GET(request: NextRequest) {
  try {
    const userid = request.nextUrl.searchParams.get("user");

    // execute the query to fetch the top 5 users by followers where the user is not following them and dont display the user itself

    const { rows: users } = await sql`
    SELECT *
    FROM Users
    WHERE userid NOT IN (
      SELECT followeeid
      FROM Follows
      WHERE followerid = ${userid}
    ) AND userid != ${userid}
    ORDER BY followers DESC
    LIMIT 5
  `;
    // return the result
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}
