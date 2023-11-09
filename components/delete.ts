import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function handleDelete(postid: string, author: any) {
     await fetch(`/api/post/${postid}`, {
       method: "DELETE",
     });
     await fetch(`/api/revalidate?path=/${author?.username}`)
   }

   export async function handleDeleteComment(commentid: string, path: string) {
      await fetch(`/api/comments/${commentid}`, {
        method: "DELETE",
      });
      await fetch(`/api/revalidate?path=${path}`, {
        method: "GET",
      }).then((res) => res.json())
    }
