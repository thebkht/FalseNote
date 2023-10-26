import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
     try {
          const popular = await postgres.post.findMany({
               orderBy: {
                 views: 'desc',
               },
               take: 5,
               include: {
                 author: true,
                 _count: {
                   select: {
                     likes: true,
                     comments: true,
                     savedUsers: true,
                   },
                 },
                 tags: true,
               }
             })

          return NextResponse.json({ popular }, { status: 200 });
     }
     catch (error) {
          console.error(error);
          return NextResponse.error();
     }
}