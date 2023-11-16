'use client'
import { getSessionUser } from "@/components/get-session-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Hash } from "lucide-react";
import Link from "next/link";
import { fetchData } from "next-auth/client/_utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserExplore({ className, ...props }: { className?: string }) {
     const [user, setUser] = useState<any>([]);
     const [isLoading, setIsLoading] = useState<boolean>(false);
     const { status } = useSession();

     async function fetchUsers() {
          setIsLoading(true);
          try {
               const data = await getSessionUser();
               const result = await fetch(`/api/explore/users?userId=${data?.id}`, {
                    method: "GET",
               }).then((res) => res.json());
               setUser(result);
               setIsLoading(false);
          } catch (error) {
               console.error(error);
               setIsLoading(false);
          }
     }

     useEffect(() => {
          fetchUsers();
     }, [status]);

     return (
          <>
               {
                    !isLoading ? (
                         <Card className={`flex flex-col space-y-4 ${className}`}>
                    <CardHeader >
                         <Avatar className="h-24 w-24 mx-auto border">
                              <AvatarImage src={user?.image} alt={user.name} />
                              <AvatarFallback>{user.name ? user.name?.charAt(0) : user.username?.charAt(0)}</AvatarFallback>
                         </Avatar>
                         {
                              user.name ? (
                                   <div className="flex flex-col py-3 lg:px-3 text-left lg:text-center">
                                        <h2 className="font-semibold leading-none text-2xl">{user.name}</h2>
                                        <h3 className="leading-none text-normal text-xl text-muted-foreground">{user.username}</h3>
                                   </div>
                              ) : (
                                   <div className="flex flex-col py-3 lg:px-3 text-left lg:text-center">
                                        <h2 className="font-semibold leading-none text-2xl">{user.username}</h2>
                                   </div>
                              )
                         }
                    </CardHeader>
                    {
                         user.tags?.length !== 0 && (
                              <CardContent className="flex flex-col">
                         <Link href={``} className="my-3 font-medium">{user._count?.tagfollower} followed tags</Link>
                         <ul className="list-none">
                              {
                                   user.tags?.map((tag: any) => (
                                        <li key={tag.id}>
                                             <Button variant={"link"} asChild className="p-0 hover:!no-underline text-foreground">
                                                  <span>
                                                       <Hash className="mr-2 h-5 w-5 text-muted-foreground" />
                                                       {tag.tag.name}
                                                  </span>
                                             </Button>
                                        </li>
                                   ))
                              }
                         </ul>
                    </CardContent>
                         )
                    }
                    <CardFooter className="flex flex-col space-y-4 items-start">
                         <Link href={``} className="my-3 font-medium text-left">{user.bookmarks?.length} saved posts</Link>
                    </CardFooter>
               </Card>
                    ) : (
                         <Card className={`flex flex-col space-y-4 bg-background ${className}`}>
                    <CardHeader >
                         <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                         <div className="py-3 space-y-2">
                         <Skeleton className="h-6 w-56 mx-auto" />
                         <Skeleton className="h-5 w-40 mx-auto" />
                         </div>
                    </CardHeader>
                    {
                         user.tags?.length !== 0 && (
                              <CardContent className="flex flex-col">
                              <Skeleton className="w-32 h-5 my-3" />
                              <div className="space-y-2.5">
                                   <Skeleton className="w-full h-5" />
                                   <Skeleton className="w-full h-5" />
                                   <Skeleton className="w-full h-5" />
                              </div>
                    </CardContent>
                         )
                    }
                    <CardFooter className="flex flex-col space-y-4 items-start">
                    <Skeleton className="w-32 h-5 my-3 text-left" />
                    </CardFooter>
               </Card>
                    )
               }
          </>
     )
}