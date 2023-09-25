import { NextRequest } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
     try{
          const followeeId = request.nextUrl.searchParams.get("followeeId");
     const followerId = request.nextUrl.searchParams.get("followerId");

     if (!followeeId || !followerId) {
          return new Response("followeeId and followerId are required query parameters", { status: 400 });
     }

     await sql`INSERT INTO Follows (FollowerID, FollowerID) VALUES (${followerId}, ${followeeId})`;

     return new Response("followed", { status: 200 });
     } catch (error: any) {
          return new Response(error.message, { status: 500 });
     }
}