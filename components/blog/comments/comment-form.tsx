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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LoginDialog from "@/components/login-dialog";
import UserHoverCard from "@/components/user-hover-card";

export default function CommentForm(props: {session: any, status: any, post: any, submitted: boolean}){
     const [commenting, setCommenting] = useState<boolean>(false)
     const [posting, setPosting] = useState<boolean>(false)
     const router = useRouter();
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
                const author = props.session.userid;
                await fetch("/api/comments/create", {
                  method: "POST",
                  body: JSON.stringify({ ...data, author, post: props.post }),
                  })
                  setPosting(false);
          } catch (error) {
                console.log(error);
                setPosting(false);
          }
          setCommenting(false);
          form.setValue("content", "");
          props.submitted = true as boolean;
        }
        

        function handleOnFocus() {
          if(props.status === "authenticated"){
               setCommenting(true);
          }
     }
     return (
          
     <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 article__comments-form flex w-full gap-3">
     
       <div className="w-full">
       <FormField
         control={form.control}
         name="content"
         render={({ field }) => (
           <FormItem className="flex gap-3">
            <div className="article__comments-form-avatar mt-2">
               {
                props.status === "authenticated" ? (
                  <UserHoverCard user={props.session} >
                    <Avatar className="h-10 w-10">
                    <AvatarImage src={props.session?.profilepicture} alt={props.session?.name} />
                    <AvatarFallback>{props.session?.name ? props.session?.name.charAt(0) : props.session?.username.charAt(0)}</AvatarFallback>
               </Avatar>
                </UserHoverCard>
                ) : (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://avatars.githubusercontent.com/u/144859178?v=4" />
                    <AvatarFallback>F</AvatarFallback>
               </Avatar>)
               }
          </div>
             <div className="w-full">
             {
              props.status === "authenticated" ? (
                <>
                  <FormControl>
               <Textarea placeholder="Write a comment..." {...field} className="w-full" onFocus={handleOnFocus} />
             </FormControl>
             <FormMessage />
                </>
                ) : (
                  <LoginDialog  className="w-full">
                    <FormControl>
               <Textarea placeholder="Write a comment..." {...field} className="w-full" onFocus={handleOnFocus} />
             </FormControl>
             <FormMessage />
                  </LoginDialog>
                  )
             }
             </div>
           </FormItem>
         )}
       />
       <Button type="submit" size={"lg"} className={`mt-2 ${commenting ? "block" : "hidden"}`} disabled={posting}>{
              posting ? "Posting..." : "Post"
       }</Button>
       </div>
     </form>
   </Form>
     )
}