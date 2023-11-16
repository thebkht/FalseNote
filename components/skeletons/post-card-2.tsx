import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function PostCardSkeleton(
     { className, ...props }: React.ComponentPropsWithoutRef<typeof Card> & { className?: string; }
) {
     return (
          <Card {...props} className={cn("feedArticleCard bg-background max-h-72 w-full border-none shadow-none my-4", className
          )}>
               <CardContent className="p-0">
                    <CardHeader className={cn("pt-4 pb-3 md:pt-6 px-0 gap-y-4")}>
                         <div className="flex items-center space-x-1">
                              <div className="flex items-center space-x-1">
                                   <Skeleton className="w-5 h-5 rounded-full" />
                                   <Skeleton className="w-20 h-5" />
                                   <Skeleton className="w-16 h-5" />
                              </div>
                         </div>
                    </CardHeader>
                    <div className="flex">
                         <div className="flex-initial w-full">
                              <div>
                                   <div className="pb-2">
                                        <Skeleton className="w-full h-6" />
                                        <Skeleton className="w-full h-6" />
                                   </div>
                                   <div className="post-subtitle hidden md:block">
                                        <Skeleton className="w-full h-5" />
                                        <Skeleton className="w-full h-5" />
                                        <Skeleton className="w-full h-5" />
                                   </div>
                              </div>
                              <div className="hidden py-8 lg:block">
                                   <div className="flex justify-between items-center">
                                        <div className="flex flex-1 items-center space-x-2.5">
                                             <Skeleton className="w-16 h-5" />
                                        </div>
                                   </div>
                              </div>

                         </div>

                         <div className="flex-none ml-6 md:ml-8">
                              <div className={`h-14 md:h-28 !relative bg-muted !pb-0 aspect-[8/5]`} >
                                   <Skeleton className="w-full h-full rounded-lg" />
                              </div>
                         </div>
                    </div>
                    <div className="py-4 lg:hidden">
                         <div className="flex justify-between items-center">
                              <div className="flex flex-1 items-center space-x-2.5">
                                   <Skeleton className="w-16 h-5" />
                              </div>
                         </div>
                    </div>
               </CardContent>
          </Card>
     )
}