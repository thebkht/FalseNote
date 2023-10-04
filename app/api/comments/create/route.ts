import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
     try {
          const data = await req.json();
          if (!data) {
               return new Response("No data provided", { status: 400 });
          }
          console.log("Received data:", data);

          const { post, content, author } = data;

    await sql`
      INSERT INTO comments (blogpostid, content, authorid)
      VALUES (${post}, ${content}, ${author})
      RETURNING *
    `;

    // Handle the result or send a response as needed

  } catch (error) {
    console.error(error);
    NextResponse.json({ error: "Internal server error" }, { status: 500});
  }
}