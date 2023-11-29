import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params} : { params: { id: string } }) {
  const { id } = params;
  const page = req.nextUrl.searchParams.get("page") ? parseInt(req.nextUrl.searchParams.get("page") as string) : 0;
  const limit = req.nextUrl.searchParams.get("limit") ? parseInt(req.nextUrl.searchParams.get("limit") as string) : 10;
  const user = await postgres.user.findFirst({
     where: { id: id },
     include: {
       bookmarks: {
         include: {
           post: {
             include: {
               author: true,
               savedUsers: true,
               _count: {
                select: {
                 likes: true,
                 savedUsers: true,
                 readedUsers: true,
                 shares: true,
                 comments: true,
                },
              },
             }
           },
         },
         orderBy: {
           updatedAt: "desc",
         },
         take: limit,
         skip: page * limit,
       },
       _count: { select: { bookmarks: true } },
     },
   });
   

  return NextResponse.json({ bookmarks: JSON.parse(JSON.stringify(user?.bookmarks)), bookmarksCount: user?._count?.bookmarks }, { status: 200 });
}