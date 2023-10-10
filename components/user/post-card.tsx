"use client"
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Icons } from "../icon";
import { Eye, Heart, MessageCircle } from "lucide-react";
import { formatNumberWithSuffix } from "../format-numbers";

export default function UserPostCard({ post, user, sessionUser, className, ...props }: React.ComponentPropsWithoutRef<typeof Card> & { post: any, user: any, sessionUser: any, className?: string }) {

     function formatDate(dateString: string | number | Date) {
          const date = new Date(dateString);
          const currentYear = new Date().getFullYear();
          const year = date.getFullYear();

          let formattedDate = date.toLocaleDateString('en-US', {
               month: 'short',
               day: 'numeric',
               hour: 'numeric',
               minute: 'numeric',
               hour12: true,
          });

          if (year !== currentYear) {
               formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
               });
          }

          return formattedDate;
     }

     return (
          <Card {...props} className={cn("rounded-lg bg-background hover:bg-card w-full", className)}>
               <Link href={`/${user.username}/${post.url}`}>
                    <CardContent className="px-4 md:px-6 py-0 h-full">
                         <div className="flex items-center flex-col md:flex-row">
                              {
                                   post.coverimage && (
                                        <div className="h-full w-full md:min-w-[180px] py-4 md:mr-4">
                                             <AspectRatio ratio={4 / 3}>
                                                  <Image
                                                       src={post.coverimage}
                                                       fill
                                                       alt={post.title}
                                                       className="rounded-md
            object-cover
            w-full
            "
                                                  />
                                             </AspectRatio>
                                        </div>
                                   )
                              }
                              <div className="flex-col w-full h-full flex justify-between">
                                   <CardHeader className={cn("py-4 md:py-6 px-0 gap-y-4")}>

                                        <CardTitle className="">{post.title}</CardTitle>
                                        <CardDescription className="text-base">
                                             {post.description && (
                                                  post.description.length! > 150 ? (
                                                       <>{post?.description?.slice(0, 150)}...</>
                                                  ) : (
                                                       <>{post.description}</>
                                                  )
                                             )}
                                        </CardDescription>
                                   </CardHeader>
                                   
                              </div>
                              
                         </div>
                         <CardFooter className="px-0 justify-between">
                                        <p className="card-text inline mb-0 text-muted-foreground">{formatDate(post.creationdate)}</p>
                                        <div className="stats flex items-center gap-3">

                                             <p className="card-text inline mb-0 text-muted-foreground flex"><Eye className="mr-1" /> {formatNumberWithSuffix(post.views)}</p>
                                             <p className="card-text inline mb-0 text-muted-foreground flex"><MessageCircle className="mr-1" /> {formatNumberWithSuffix(post.comments?.length)}</p>
                                             <p className="card-text inline mb-0 text-muted-foreground flex"><Heart className="mr-1" /> {formatNumberWithSuffix(post.likes)}</p>
                                        </div>
                                   </CardFooter>
                    </CardContent>
               </Link>
          </Card>
     )
}