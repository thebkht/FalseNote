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
import { useRouter } from "next/navigation";
import LoginDialog from "@/components/login-dialog";
import UserHoverCard from "@/components/user-hover-card";
import { getSessionUser } from "@/components/get-session-user";
import { ArrowUp } from "lucide-react";

const sessionUser = async () => {
     const sessionUser = await getSessionUser();
     return sessionUser as any;
}

export default function CommentForm(props: { post: any, session: any}){
     const [commenting, setCommenting] = useState<boolean>(false)
     const [posting, setPosting] = useState<boolean>(false)
     const router = useRouter();
     const { status } = useSession();
     const [open, setOpen] = useState(false);
     const session = sessionUser() as any;
     const commentFormSchema = z.object({
          content: z.string().min(1, "Please enter some content."),
        })
        
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
          try{
                const author =( await getSessionUser())?.id;
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
          const path = encodeURIComponent(`/${props.post.author.username}/${props.post.url}`);
          await fetch(`/api/revalidate?path=${path}`, {
               method: "GET",
               }).then((res) => res.json());
          router.push(`/${props.post.author.username}/${props.post.url}#comments`);
        }
        

        function handleOnFocus() {
          if(status === "authenticated"){
               setCommenting(true);
          }
     }
     return (
          
     <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 article__comments-form flex w-full gap-3">
     
       <div className="w-full flex gap-x-3">
       <FormField
         control={form.control}
         name="content"
         render={({ field }) => (
           <FormItem className="flex gap-x-3 w-full">
            <div className="article__comments-form-avatar mt-2">
               {
                status === "authenticated" ? (
                  <UserHoverCard user={props.session} >
                    <Avatar className="h-10 w-10">
                    <AvatarImage src={props.session?.image} alt={props.session?.name} />
                    <AvatarFallback>{props.session?.name ? props.session?.name?.charAt(0) : props.session?.username?.charAt(0)}</AvatarFallback>
               </Avatar>
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
               <Textarea placeholder="Write a comment..." {...field} className="w-full" onFocus={handleOnFocus}  />
             </FormControl>
             <FormMessage />
                </>
                ) : (
                  <LoginDialog  className="w-full">
                    <FormControl>
               <Textarea placeholder="Write a comment..." {...field} className="w-full" readOnly />
             </FormControl>
             <FormMessage />
                  </LoginDialog>
                  )
             }
             </div>
           </FormItem>
         )}
       />
       <Button type="submit" size={"icon"} className={`mt-2 ${commenting ? "block" : "hidden"} ease-in duration-1000 h-10 w-10`} disabled={posting}>
             <div className="h-10 w-10 flex justify-center items-center">
             <ArrowUp className="h-[1.2rem] w-[1.2rem] m-auto" />
             </div>
       </Button>
       </div>
     </form>
   </Form>
     )
}