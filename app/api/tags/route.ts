import { sql } from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
     const tagid = req.nextUrl.searchParams.get("tagId")

     if (!tagid){
          return new NextResponse("Missing tagid or userid", {status: 400})
     } 

     try{
          const rows = await sql`
          SELECT * FROM Tags WHERE TagID = ${tagid}
          `
          if (rows.length === 0){
               return new NextResponse("Tag not found", {status: 404})
          }

          //get followers
          const followers = await sql`
          SELECT * FROM TagFollows WHERE TagID = ${tagid}
          `
          rows[0].followers = followers

          return new NextResponse(JSON.stringify(rows[0]), {status: 200})
     } catch (error) {
          return new NextResponse("Failed to get tag", {status: 500})
     }
}