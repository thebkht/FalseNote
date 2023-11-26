import postgres from "@/lib/postgres";
import { getSessionUser } from "@/components/get-session-user";
import { revalidatePath } from "next/cache";

export const handlePostSave = async ({
  postId,
  path,
}: {
  postId: string;
  path: string;
}) => {
  console.log("Post id:", postId);
  await fetch(`/api/post/${postId}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId }),
  });
};
