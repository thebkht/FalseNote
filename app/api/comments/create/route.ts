import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
     try {
          const data = await req.json();
          if (!data) {
               return new Response("No data provided", { status: 400 });
          }

          const { post, content, author } = data;

    // await sql`
    //   INSERT INTO comments (blogpostid, content, authorid)
    //   VALUES (${post}, ${content}, ${author})
    //   RETURNING *
    // `;
    await postgres.comment.create({
      data: {
        content: content,
        authorId: author,
        postId: post,
        parentId: null,
      },
    });

    // const authorDetails = await postgres.user.findFirst({
    //   where: {
    //     id: author,
    //   },
    // });
    // const postDetails = await postgres.post.findFirst({
    //   where: {
    //     id: post,
    //   },
    // });

    // // Send a notification to the author of the post using api/notifications post method body json
    // const message = `${authorDetails?.username} commented on your post "${postDetails?.title}: ${content}"`;
    // const user_id = postDetails?.authorId;
    // const type = "comment";
    // const created_at = new Date().toISOString()
    // const read_at = null
    // const sender_id = authorDetails?.id;

    // await postgres.notification.create({
    //   data: {
    //     content: message,
    //     type: type,
    //     createdAt: created_at,
    //     receiverId: user_id!,
    //     senderId: sender_id!,
        
    //   },
    // });

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