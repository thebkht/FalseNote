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

export default function CommentForm(props: { post: any, session: any }) {
  const [commenting, setCommenting] = useState<boolean>(false)
  const [posting, setPosting] = useState<boolean>(false)
  const router = useRouter();
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const commentFormSchema = z.object({
    content: z.string().min(1, "Please enter some content."),
  })
  const pathname = usePathname();

  type commentFormValues = z.infer<typeof commentFormSchema>

  // This can come from your database or API.
  const defaultValues: Partial<commentFormValues> = {
  }

  const form = useForm<commentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues,
    mode: "onChange",
  })

  async function onSubmit(data: commentFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setPosting(true);
    try {
      const author = (await getSessionUser())?.id;
      await fetch("/api/comments/create", {
        method: "POST",
        body: JSON.stringify({ ...data, author, post: props.post.id }),
      })
      setPosting(false);
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
    setCommenting(false);
    form.setValue("content", "");
    await fetch(`/api/revalidate?path=${pathname}`, {
      method: "GET",
    }).then((res) => res.json());
    router.refresh();
  }
  return (
    <div className="my-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 article__comments-form flex w-full gap-3" id="comment">

          <div className="w-full">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 w-full px-1">
                  <div className="article__comments-form-avatar mt-2">
                    {
                      status === "authenticated" ? (
                        <UserHoverCard user={props.session} >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={props.session?.image} alt={props.session?.name} />
                              <AvatarFallback>{props.session?.name ? props.session?.name?.charAt(0) : props.session?.username?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">{props.session.name || props.session.username}</p>
                          </div>
                        </UserHoverCard>
                      ) : (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/favicon.ico" />
                          <AvatarFallback>F</AvatarFallback>
                        </Avatar>)
                    }
                  </div>
                  <div className="w-full">
                    {
                      status === "authenticated" ? (
                        <>
                          <FormControl>
                            <Textarea placeholder="Write a comment..." {...field} className="w-full" onFocus={() => setCommenting(true)} readOnly={commenting ? false : true} />
                          </FormControl>
                          <FormMessage />
                        </>
                      ) : (
                        <LoginDialog className="w-full">
                          <FormControl>
                              <Textarea placeholder="Write a comment..." className="w-full" readOnly />
                            </FormControl>
                        </LoginDialog>
                      )
                    }
                  </div>
                </FormItem>
              )}
            />

          </div>
        </form>
      </Form>
      <div className={`ml-auto mt-4 flex ${commenting ? "" : "opacity-0"} ease-in duration-700 gap-3`}>
        <Button variant="ghost" className="flex gap-2 items-center" onClick={() => setCommenting(false)} disabled={!commenting}>
          Cancel
        </Button>
        <Button type="submit" form={"comment"} disabled={!commenting || posting}>
          Comment
        </Button>
      </div>
    </div>
  )
}