import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/postgres";

export async function GET(request: NextRequest) {
     try {
          const url = request.nextUrl.searchParams.get("url");
          const authorId = request.nextUrl.searchParams.get("authorId");

          if (!url) {
               return new Response("url is required query parameter", { status: 400 });
          }

          const isUrlValid = await sql("SELECT * FROM blogposts WHERE url = $1 AND authorid = $2", [url, authorId]);

          if (isUrlValid.length > 0) {
               return new Response("url is not available", { status: 400 });
          } else {
               return new Response("url is available", { status: 200 });
          }
     } catch (error: any) {
          return new Response(error.message, { status: 500 });
     }
}
