import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params} : { params: { id: string } }) {
  const { id } = params;
  const page = req.nextUrl.searchParams.get("page") ? parseInt(req.nextUrl.searchParams.get("page") as string) : 0;
  const limit = req.nextUrl.searchParams.get("limit") ? parseInt(req.nextUrl.searchParams.get("limit") as string) : 5;
  const user = await postgres.user.findFirst({
     where: { id: parseInt(id) },
     include: {
     readinghistory: {
         include: {
           post: {
             include: {
               author: true,
             }
           },
         },
         orderBy: {
           updatedAt: "desc",
         },
         take: limit,
         skip: page * limit,
       },
       _count: { select: { readinghistory: true } },
     },
   });
   

  return NextResponse.json({ history: JSON.parse(JSON.stringify(user?.readinghistory)), historyCount: user?._count?.readinghistory }, { status: 200 });
}