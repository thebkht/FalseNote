import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

const baseQuery = {
     orderBy: {
        views: "desc" as const,
     },
     include: {
       author: true,
       savedUsers: true,
       _count: {
         select: {
           likes: true,
           savedUsers: true,
         },
       },
       tags: {
         take: 1,
         include: {
           tag: true,
         },
       },
     },
   };

export async function GET(req: NextRequest) {
     const pageString = req.nextUrl.searchParams.get("page");
     const page = pageString ? parseInt(pageString) : 0;
     const search = req.nextUrl.searchParams.get("search");
     const limit = 5;

     try {
          const posts = await postgres.post.findMany({
               ...baseQuery,
               where: search ? {
                    /* OR: [
                         {
                              title: {
                                   contains: search,
                                   mode: "insensitive",
                              },
                         },
                         {
                              content: {
                                   contains: search,
                                   mode: "insensitive",
                              },
                         },
                    ], */
                    title: {
                         contains: search,
                         mode: "insensitive",
                    },
               } : undefined,
               take: limit,
               skip: page * limit,
          });

          return NextResponse.json({ posts: posts }, { status: 200 });
     } catch (error) {
          console.error(error);
          return NextResponse.json({ error: error }, { status: 500 });
     }
}