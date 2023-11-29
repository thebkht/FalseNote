import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function PostCardSkeletonV2(
     { className, ...props }: React.ComponentPropsWithoutRef<typeof Card> & { className?: string; }
) {
     return (
          <Card {...props} className={cn("feedArticleCard bg-background max-h-72 w-full my-4", className
          )}>
               <CardContent className="md:p-6 p-4">
               <CardHeader className={cn("pb-4 pt-0 px-0 gap-y-4")}>
                         <div className="flex items-center space-x-1">
                              <div className="flex items-center gap-1.5">
                                   <Skeleton className="w-40 h-5" />
                              </div>
                         </div>
                    </CardHeader>
                    <div className="flex">
                         <div className="flex-initial w-full">
                              <div>
                                   <div className="pb-4 space-y-2">
                                        <Skeleton className="w-full h-6" />
                                        <Skeleton className="w-full h-6" />
                                   </div>
                                   <div className="post-subtitle hidden md:block space-y-1.5">
                                        <Skeleton className="w-full h-5" />
                                        <Skeleton className="w-full h-5" />
                                        <Skeleton className="w-full h-5" />
                                   </div>
                              </div>
                              <div className="hidden pt-8 lg:block">
                                   <div className="flex justify-between items-center">
                                        <div className="flex flex-1 items-center space-x-2.5">
                                             <Skeleton className="w-32 h-5" />
                                        </div>
                                   </div>
                              </div>

                         </div>

                         <div className="flex-none ml-6 md:ml-8">
                              <div className={`h-14 md:h-28 !relative bg-muted !pb-0 aspect-[8/5] rounded-lg`} >
                                   <Skeleton className="w-full h-full rounded-lg" />
                              </div>
                         </div>
                    </div>
                    <div className="pt-4 lg:hidden">
                         <div className="flex justify-between items-center">
                              <div className="flex flex-1 items-center space-x-2.5">
                                   <Skeleton className="w-32 h-5" />
                              </div>
                         </div>
                    </div>
               </CardContent>
          </Card>
     )
}