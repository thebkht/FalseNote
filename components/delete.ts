import { redirect } from "next/navigation";

export async function handleDelete(postid: string, author: any) {
     await fetch(`/api/post/${postid}`, {
       method: "DELETE",
     });
     await fetch(`/api/revalidate?path=/${author?.username}`)
   }