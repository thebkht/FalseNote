import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres"

export async function POST(req: NextRequest) {
     try {
          const data = await req.formData();
          if (!data) {
               return new Response("No data provided", { status: 400 });
          }
          console.log("Received data:", data);

          const { title, content, authorId, visibility, } = Object.fromEntries(data);
     } catch (error) {
          console.error("Error:", error);
          return NextResponse.json({body: "Error processing data"},
            {status: 500});
        }
        return NextResponse.json({body: "Unsupported method"}, {status: 405});
      }
     