'use server'
import { revalidatePath, revalidateTag } from "next/cache"

export const validate = async (path: string) => {
     if (path) {
          revalidatePath(path)
          revalidateTag(path)
     }
}