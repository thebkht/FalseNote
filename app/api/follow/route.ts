import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/postgres";

export async function GET(request: NextRequest) {
     try{
          const followeeId = request.nextUrl.searchParams.get("followeeId");
     const followerId = request.nextUrl.searchParams.get("followerId");

     if (!followeeId || !followerId) {
          return new Response("followeeId and followerId are required query parameters", { status: 400 });
     }

     const isFollowed = await sql`SELECT * FROM follows WHERE followeeId = ${followeeId} AND followerId = ${followerId}`;

     if (isFollowed.length > 0) {
          await sql`DELETE FROM follows WHERE followeeId = ${followeeId} AND followerId = ${followerId}`;

          return NextResponse.json({ message: "unfollowed" }, { status: 200 });
     } else {
          await sql`INSERT INTO follows (followeeId, followerId) VALUES (${followeeId}, ${followerId})`;

          const followerDetails = await sql`SELECT * FROM users WHERE userid = ${followerId}`;

          const message = `${followerDetails[0].username} is now following you`;
          const user_id = followeeId;
          const type = "follow";
          const created_at = new Date().toISOString();
          const read_at = null;
          const sender_id = followerId;

          await sql`
            INSERT INTO notifications (type, message, userid, createdat, readat, sender_id)
            VALUES (${type}, ${message}, ${user_id}, ${created_at}, ${read_at}, ${sender_id})
          `;
     }

     return NextResponse.json({ message: "followed" }, { status: 200 });
     } catch (error: any) {
          return new Response(error.message, { status: 500 });
     }
}