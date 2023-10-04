import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

export default function CommentForm(){
     const [commenting, setCommenting] = useState<boolean>(false)
     const [comment, setComment] = useState<string>("")
     const [sessionUser, setSessionUser] = useState<any>(null)
     const { data: session, status } = useSession();
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

        function onSubmit(values: z.infer<typeof commentFormSchema>) {
          // Do something with the form values.
          // ✅ This will be type-safe and validated.
          console.log(values)
        }
        

        function handleOnFocus() {
          if (status !== "authenticated") {
               router.push("/login")
          }
          setCommenting(true);
     }

     function handleSubmit(e: React.ChangeEvent<HTMLTextAreaElement>) {
          const commentContent = e.target.value;
          console.log(commentContent);
          setComment(commentContent);
     }
     return (
          
     <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 article__comments-form flex w-full gap-3">
     <div className="article__comments-form-avatar">
               <Avatar className="h-14 w-14">
                    <AvatarImage src={sessionUser?.profilepicture} alt={sessionUser?.name} />
                    <AvatarFallback>{sessionUser?.name ? sessionUser?.name.charAt(0) : sessionUser?.username.charAt(0)}</AvatarFallback>
               </Avatar>
          </div>
       <div className="w-full">
       <FormField
         control={form.control}
         name="content"
         render={({ field }) => (
           <FormItem className="space-y-0">
             <FormControl>
               <Textarea placeholder="Write a comment..." {...field} className="w-full" onFocus={handleOnFocus} />
             </FormControl>
             <FormMessage />
           </FormItem>
         )}
       />
       <Button type="submit" size={"lg"} className={`mt-2 ${commenting ? "block" : "hidden"}`}>Submit</Button>
       </div>
     </form>
   </Form>
     )
}