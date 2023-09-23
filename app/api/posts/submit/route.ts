import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres"

export async function POST(req: NextRequest) {
     try {
          const data = await req.json();
          const authorId = req.nextUrl.searchParams.get("authorId");
          if (!data) {
               return new Response("No data provided", { status: 400 });
          }
          console.log("Received data:", data);
          console.log("Received authorId:", authorId);

          const { title, content, coverImage, visibility, topics, url } = Object.fromEntries(data);
     } catch (error) {
          console.error("Error:", error);
          return NextResponse.json({body: "Error processing data"},
            {status: 500});
        }
        return NextResponse.json({body: "Unsupported method"}, {status: 405});
      }
     