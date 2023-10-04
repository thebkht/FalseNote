import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { FormControl, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

export default function LoginDialog({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof Dialog> & { children: React.ReactNode, className?: string }) {
     return (
          <Dialog {...props}>
               <DialogTrigger className={cn(className)}>
                    {children}
               </DialogTrigger>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>Sign up to continue</DialogTitle>
                         <DialogDescription className="mb-4">
                              You need to sign up or sign in to continue.
                         </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => signIn("github")} className="mt-4">Join Now</Button>
               </DialogContent>
          </Dialog>
     )
}