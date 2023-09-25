import { NextRequest } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
     try{
          const followeeId = request.nextUrl.searchParams.get("followeeId");
     const followerId = request.nextUrl.searchParams.get("followerId");

     if (!followeeId || !followerId) {
          return new Response("followeeId and followerId are required query parameters", { status: 400 });
     }

     const isFollowed = await sql`SELECT * FROM follows WHERE followeeId = ${followeeId} AND followerId = ${followerId}`;

     if (isFollowed.rowCount > 0) {
          await sql`DELETE FROM follows WHERE followeeId = ${followeeId} AND followerId = ${followerId}`;
     } else {
          await sql`INSERT INTO follows (followeeId, followerId) VALUES (${followeeId}, ${followerId})`;
     }

     return new Response("followed", { status: 200 });
     } catch (error: any) {
          return new Response(error.message, { status: 500 });
     }
}