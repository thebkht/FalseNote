import { NextRequest, NextResponse } from "next/server";
import postgres from "@/lib/postgres";

export async function GET(request: NextRequest) {
     try{
          const followeeId = request.nextUrl.searchParams.get("followeeId");
     const followerId = request.nextUrl.searchParams.get("followerId");

     if (!followeeId || !followerId) {
          return new Response("followeeId and followerId are required query parameters", { status: 400 });
     }

     const isFollowed = await postgres.follow.findFirst({
          where: {
               followerId: followerId,
               followingId: followeeId
          }
     })

     if (isFollowed) {
          await postgres.follow.deleteMany({
               where: {
                    followerId: followerId,
                    followingId: followeeId
               }
          })

          return NextResponse.json({ message: "unfollowed" }, { status: 200 });
     } else {
          await postgres.follow.create({
               data: {
                    followerId: followerId,
                    followingId: followeeId
               }
          })
          
          return NextResponse.json({ message: "followed" }, { status: 200 });
          // const followerDetails = await sql('SELECT * FROM users WHERE userid = $1', [followerId])

          // const message = `${followerDetails[0].username} is now following you`;
          // const user_id = followeeId;
          // const type = "follow";
          // const created_at = new Date().toISOString();
          // const read_at = null;
          // const sender_id = followerId;

          // await sql`
          //   INSERT INTO notifications (type, message, userid, createdat, readat, sender_id)
          //   VALUES (${type}, ${message}, ${user_id}, ${created_at}, ${read_at}, ${sender_id})
          // `;
          //await sql('INSERT INTO notifications (type, message, userid, createdat, readat, sender_id) VALUES ($1, $2, $3, $4, $5, $6)', [type, message, user_id, created_at, read_at, sender_id])
     }

     
     } catch (error: any) {
          return new Response(error.message, { status: 500 });
     }
}