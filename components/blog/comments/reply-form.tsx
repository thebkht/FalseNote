"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import LoginDialog from "@/components/login-dialog";
import UserHoverCard from "@/components/user-hover-card";
import { getSessionUser } from "@/components/get-session-user";
import { ArrowUp } from "lucide-react";

export default function ReplyForm(props: { post: any, session: any, onCanceled: () => void, onReplied: () => void, comment: any }) {
  const [posting, setPosting] = useState<boolean>(false)
  const router = useRouter();
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const replyFormSchema = z.object({
    content: z.string().min(1, "Please enter some content."),
  })
  const pathname = usePathname();

  type replyFormValues = z.infer<typeof replyFormSchema>

  // This can come from your database or API.
  const defaultValues: Partial<replyFormValues> = {
  }

  const form = useForm<replyFormValues>({
    resolver: zodResolver(replyFormSchema),
    defaultValues,
    mode: "onChange",
  })

  async function onSubmit(data: replyFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setPosting(true);
    try {
      const author = (await getSessionUser())?.id;
      await fetch("/api/comments/reply", {
        method: "POST",
        body: JSON.stringify({ ...data, author, post: props.post.id, comment: props.comment.id }),
      })
      setPosting(false);
      props.onReplied();
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
    form.setValue("content", "");
    await fetch(`/api/revalidate?path=${pathname}`, {
      method: "GET",
    }).then((res) => res.json());
    router.refresh();
  }

  return (
    <div className="my-4 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 article__comments-form flex w-full gap-3" id="reply">

          <div className="w-full">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 w-full px-1">
                  <>
                          <FormControl>
                            <Textarea placeholder="Write a comment..." {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </>
                </FormItem>
              )}
            />

          </div>
        </form>
      </Form>
      <div className={`ml-auto mt-4 flex ease-in duration-700 gap-3`}>
        <Button variant="ghost" className="flex gap-2 items-center" onClick={props.onCanceled}>
          Cancel
        </Button>
        <Button type="submit" form={"reply"} disabled={posting}>
          Comment
        </Button>
      </div>
    </div>
  )
}