import { getSessionUser } from "@/components/get-session-user";
import postgres from "@/lib/postgres";

export async function POST(req: Request) {
  try {
    const { commentId } = await req.json();
    const user = await getSessionUser();
    if (!user) {
      console.log("No session user");
      return new Response(null, { status: 401 });
    }
    const comment = await postgres.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      return new Response(null, { status: 404 });
    }
    const isLiked = await postgres.commentLike.findFirst({
      where: {
        commentId,
        authorId: user.id,
      },
    });
    if (isLiked) {
      await postgres.commentLike.delete({
        where: {
          id: isLiked.id,
        },
      });
      console.log("Deleted like");
    } else {
      await postgres.commentLike.create({
        data: {
          commentId,
          authorId: user.id,
        },
      });
      console.log("Created like");
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
