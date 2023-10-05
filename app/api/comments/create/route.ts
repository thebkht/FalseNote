import { sql } from "@vercel/postgres";
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

    const { rows: authorDetails } = await sql`
      SELECT * FROM users WHERE userid = ${author}
    `;
    const { rows: postDetails } = await sql`
      SELECT * FROM blogposts WHERE postid = ${post}
    `;

    // Send a notification to the author of the post using api/notifications post method body json
    const message = `${authorDetails[0].username} commented on your post "${postDetails[0].title}: ${content}"`;
    const user_id = postDetails[0].authorid;
    const type = "comment";
    const created_at = new Date().toISOString()
    const read_at = null

    await sql`
      INSERT INTO notifications (type, message, userid, createdat, readat)
      VALUES (${type}, ${message}, ${user_id}, ${created_at}, ${read_at})
    `;

    // const notification = await fetch(`localhost:3000/api/notifications`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ type, message, user_id }),
    // });

    // console.log("Notification response:", notification);

    // if (!notification.ok) {
    //   // Handle fetch error if needed
    //   return new NextResponse("Failed to send notification", { status: 500 });
    // }

    return new NextResponse("Comment created", { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500});
  }
}