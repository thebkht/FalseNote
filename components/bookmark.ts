"use server";
import postgres from "@/lib/postgres";
import { getSessionUser } from "@/components/get-session-user";
import { revalidatePath } from "next/cache";
import { ObjectId } from "bson";

export const handlePostSave = async ({
  postId,
  path,
}: {
  postId: string;
  path: string;
}) => {
  const sessionUser = await getSessionUser();
  try {
    if (!sessionUser) {
    console.log("No session user");
    return null;
  }
    console.log("Session id:", sessionUser?.id);
    const saved = await postgres.bookmark.findFirst({
      where: {
        postId,
        userId: sessionUser.id,
      },
      select: {
        id: true,
      },
    });

    if (sessionUser?.id) {
      if (saved) {
        await postgres.bookmark.delete({
          where: {
            id: saved.id,
          },
        });
      } else {
        await postgres.bookmark.create({
          data: {
            id: new ObjectId().toHexString(),
            userId: sessionUser.id,
            postId,
          },
        });
      }

      revalidatePath(path);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
