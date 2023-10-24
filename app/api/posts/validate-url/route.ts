import { NextRequest, NextResponse } from "next/server";
import postgres from "@/lib/postgres";

export async function GET(request: NextRequest) {
     try {
          const url = request.nextUrl.searchParams.get("url");
          const authorId = request.nextUrl.searchParams.get("authorId")?.toString();

          if (!url) {
               return new Response("url is required query parameter", { status: 400 });
          }

          const isUrlValid = await postgres.post.findUnique({
               where: {
                    url: url,
                    authorId: authorId,
               },
          })
          if (isUrlValid) {
               return new Response("url is not available", { status: 400 });
          } else {
               return new Response("url is available", { status: 200 });
          }
     } catch (error: any) {
          return new Response(error.message, { status: 500 });
     }
}
