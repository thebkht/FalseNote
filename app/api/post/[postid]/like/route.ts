import { getSessionUser } from "@/components/get-session-user";
import postgres from "@/lib/postgres";

export async function POST(req: Request) {
     try {
     const { postId } = await req.json();
     const user = await getSessionUser();
     if (!user) {
          console.log("No session user");
          return new Response(null, { status: 401 });
     }
     const post = await postgres.post.findUnique({
          where: {
          id: postId,
          },
     });
     if (!post) {
          return new Response(null, { status: 404 });
     }
     const isLiked = await postgres.like.findFirst({
          where: {
          postId,
          authorId: user.id,
          },
     });
     if (isLiked) {
          await postgres.like.delete({
          where: {
               id: isLiked.id,
          },
          });
          console.log("Deleted like");
     } else {
          await postgres.like.create({
          data: {
               post: {
               connect: {
               id: postId,
               },
               },
               author: {
               connect: {
               id: user.id,
               },
               },
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