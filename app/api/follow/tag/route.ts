import { sql } from "@/lib/postgres"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
     const tagid = request.nextUrl.searchParams.get("tagId")
     const userid = request.nextUrl.searchParams.get("userId")

     try {
          if (!tagid || !userid){
               return new NextResponse("Missing tagid or userid", {status: 400})
          } 
          //check if tag exists
          const rows = await sql`
          SELECT * FROM Tags WHERE TagID = ${tagid}
          `
          if (rows.length === 0){
               return new NextResponse("Tag not found", {status: 404})
          }
          //check if user follows tag
          const follows = await sql`
          SELECT * FROM TagFollows WHERE TagID = ${tagid} AND UserID = ${userid}
          `
          if (follows.length !== 0){
               await sql`
               DELETE FROM TagFollows WHERE TagID = ${tagid} AND UserID = ${userid}
               `
               return new NextResponse("Tag unfollowed", {status: 200})
          } else {
               const result = await sql`
     INSERT INTO TagFollows (TagID, UserID) VALUES (${tagid}, ${userid})
     `
     if (result.length === 1){
          return new NextResponse("Tag followed", {status: 200})
     } else {
          return new NextResponse("Failed to follow", {status: 500})
     }
          }
     } catch (error) {
          return new NextResponse("Failed to follow", {status: 500})
     }
}