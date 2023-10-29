import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

// api to execute the top users query by followers and return the result
export async function GET(request: NextRequest) {
  try {
    const userid = Number(request.nextUrl.searchParams.get("user")); 
    
    const topUsers = await postgres.user.findMany({
      include: {
        Followers: true,
        Followings: true,
        posts: true,
      },
      take: 5,
      where: {
        id: {
          not: userid,
        },
        Followers: {
          none: {
            followerId: userid,
          },
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
