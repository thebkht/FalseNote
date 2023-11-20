import { create } from "@/lib/notifications/create-notification";
import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    if (!data) {
      return new Response("No data provided", { status: 400 });
    }

    const { post, content, author, comment } = data;

    await postgres.comment.create({
      data: {
        content: content,
        authorId: author,
        postId: post,
        parentId: comment,
      },
    });
    // Get the author of the post and the post details
    const authorDetails = await postgres.user.findUnique({
      where: {
        id: author,
      },
    });

    const receiver = await postgres.comment.findUnique({
      where: {
        id: comment,
      },
      include: {
        post: {
          select: {
            url: true,
            author: {
              select: {
                username: true,
              }
            }
          },
          }
      },
    });

    // Replace content with converted markdown
    const commentContent = content.replace(/<[^>]*>?/gm, "");

    // Send a notification to the author of the post using api/notifications post method body json
    const message = `${authorDetails?.name || authorDetails?.username} replied to your comment "${commentContent}"`;
    const type = "comment";
    const url = `/@${receiver?.post.author.username}/${receiver?.post?.url}?commentsOpen=true`;
    if (receiver?.authorId && authorDetails?.id) {
      await create({
        content: message,
        type,
        url,
        receiverId: receiver.authorId,
        senderId: authorDetails.id,
      });
    }

    return new NextResponse("Reply created", { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
