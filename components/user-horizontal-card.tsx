import Link from "next/link";
import { Card, CardContent, CardHeader } from "./ui/card";
import UserHoverCard from "./user-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Icons } from "./icon";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function UserHorizontalCard({ user, className, ...props }: { user: any } & React.ComponentPropsWithoutRef<typeof Card>) {
     return (
          <Card className={cn("rounded-lg feedArticleCard !bg-background max-h-72 w-full border-none shadow-none", className)} {...props}>
               <CardContent className="flex space-x-3 w-full items-center justify-between p-4">
                    <UserHoverCard user={user}>
                         <Link href={`/${user.username}`}>
                              <Avatar className="h-12 w-12 mr-2">
                                   <AvatarImage src={user.image} alt={user.username} />
                                   <AvatarFallback>{user.name?.charAt(0) || user.username?.charAt(0)}</AvatarFallback>
                              </Avatar>
                         </Link>
                    </UserHoverCard>
                    <div className="flex justify-between w-full gap-8">
                         <Link href={`/${user.username}`}>
                              <div className="w-full flex flex-col">

                                   <div className="flex items-center">
                                   <h2 className="line-clamp-2 max-h-10 text-ellipsis font-medium">{user.name || user.username} 
                                   </h2>
                                   {user.verified && (
                                        <Icons.verified className="h-4 w-4 mx-0.5 inline fill-primary align-middle" />
                                   )}
                                   </div>
                                   {
                                        user.bio && (
                                             <div className="mt-0.5 max-w-full break-words whitespace-pre-wrap">
                                                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                                             </div>
                                        )
                                   }
                              </div>
                         </Link>
                         <Button size={"lg"}>
                              Follow
                         </Button>
                    </div>
               </CardContent>
          </Card>
     )
}