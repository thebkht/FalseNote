import { NextRequest } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
     try {
          const url = request.nextUrl.searchParams.get("url");
          const authorId = request.nextUrl.searchParams.get("authorId");

          if (!url) {
               return { status: 400, body: "url is required query parameter" };
          }

          const isUrlValid = await sql`SELECT * FROM blogposts WHERE url = ${url} AND AuthorId = ${authorId}`;

          if (isUrlValid.rowCount > 0) {
               return { status: 400, body: "url is already taken" };
          } else {
               return { status: 200, body: "url is available" };
          }
     } catch (error: any) {
          return { status: 500, body: error.message };
     }
}