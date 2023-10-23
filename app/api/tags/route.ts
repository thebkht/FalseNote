import postgres from "@/lib/postgres";
import { tr } from "date-fns/locale";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
     const tagid = req.nextUrl.searchParams.get("tagId")

     if (!tagid){
          return new NextResponse("Missing tagid or userid", {status: 400})
     } 

     try{
          const rows = await postgres.tag.findFirst({
               where: {
                    id: Number(tagid)
               },
               include: {
                    _count: {
                         select: { 
                              posts: true,
                              followingtag: true
                         }
                    },
                    followingtag: true
               }
          })
          if (!rows){
               return new NextResponse("Tag not found", {status: 404})
          }

          return new NextResponse(JSON.stringify(rows), {status: 200})
     } catch (error) {
          return new NextResponse("Failed to get tag", {status: 500})
     }
}