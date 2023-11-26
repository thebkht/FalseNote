import { create } from "@/lib/notifications/create-notification";
import postgres from "@/lib/postgres";
import { Comment } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
     try {
          const data = await req.json();
          if (!data) {
               return new Response("No data provided", { status: 400 });
          }

          const { post, content, author } = data;

    await postgres.comment.update({
          where: {
          id: params.id,
          },
          data: {
          content: content,
          },
     
    })

    return new NextResponse("Comment updated", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500});
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
     try {
          const replies = await postgres.comment.findMany({
               where: {
                    parentId: params.id,
               },
               select: {
                    id: true,
               },
          }).then((comments) => comments.map((comment) => comment.id));

          replies.forEach((reply) => deleteComment(reply));

          await deleteComment(params.id);
          
          return new NextResponse("Comment deleted", { status: 200 });
     } catch (error) {
          console.error(error);
          return NextResponse.json({ error: "Internal server error" }, { status: 500});
     }
}

async function deleteComment(id: Comment["id"]) {
     await postgres.commentLike.deleteMany({
          where: {
               commentId: id,
          },
     })
     await postgres.commentLike.deleteMany({
          where: {
               commentId: {
                    in: await postgres.comment.findMany({
                         where: {
                              parentId: id,
                         },
                         select: {
                              id: true,
                         },
                    }).then((comments) => comments.map((comment) => comment.id)),
               },
          },
     })
     await postgres.comment.deleteMany({
          where: {
               parentId: id,
          },
     })
     
     await postgres.comment.delete({

          where: {
               id: id,
          },
     })
}