import postgres from "@/lib/postgres"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
     const tagid = Number(request.nextUrl.searchParams.get("tagId"))
     const userid = Number(request.nextUrl.searchParams.get("userId"))

     try {
          if (!tagid || !userid){
               return new NextResponse("Missing tagid or userid", {status: 400})
          } 
          //check if tag exists
          const rows = await postgres.tag.findFirst({
               where: {
                    id: tagid
               }
          })

          if (!rows){
               return new NextResponse("Tag not found", {status: 404})
          }
          //check if user follows tag
          const follows = await postgres.tagFollow.findFirst({
               where: {
                    tagId: tagid,
                    followerId: userid
               }
          })
          if (follows){
               await postgres.tagFollow.deleteMany({
                    where: {
                         tagId: tagid,
                         followerId: userid
                    }
               })
               return new NextResponse("Tag unfollowed", {status: 200})
          } else {
               await postgres.tagFollow.create({
                    data: {
                         tagId: tagid,
                         followerId: userid
                    }
               })
               return new NextResponse("Tag followed", {status: 200})
          }
     } catch (error) {
          return new NextResponse("Failed to follow", {status: 500})
     }
}