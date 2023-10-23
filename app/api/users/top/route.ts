import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

// api to execute the top users query by followers and return the result
export async function GET(request: NextRequest) {
  try {
    const userid = Number(request.nextUrl.searchParams.get("user"));

    // execute the query to fetch the top 5 users by followers where the user is not following them and dont display the user itself

  //   const users = await sql`
  //   SELECT *
  //   FROM Users
  //   WHERE userid NOT IN (
  //     SELECT followeeid
  //     FROM Follows
  //     WHERE followerid = ${userid}
  //   ) AND userid <> ${userid}
  //   ORDER BY (SELECT COUNT(*) FROM Follows WHERE followeeid = Users.userid) DESC
  //   LIMIT 5
  // `;
    // const users = await sql('SELECT * FROM Users WHERE userid NOT IN (SELECT followeeid FROM Follows WHERE followerid = $1) AND userid <> $1 ORDER BY (SELECT COUNT(*) FROM Follows WHERE followeeid = Users.userid) DESC LIMIT 5', [userid])      
    const topUsers = await postgres.user.findMany({
      include: {
        Followers: true,
        Following: true,
        posts: true,
      },
      take: 5,
      where: {
        NOT: {
          Followers: {
            some: {
              followerId: userid as number, // Replace with the user's ID
            },
          },
        },
        id: {
          not: userid, // Replace with the user's ID
        },
      },
      orderBy: {
        Followers: {
          _count: 'desc',
        },
      },
    });
    
    // return the result
    return NextResponse.json({ topUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
