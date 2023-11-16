import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function TagsCardSkeleton(
     { className, ...props }: React.ComponentPropsWithoutRef<typeof Card> & { className?: string; }
) {
     return (
          <Card className="feed__content_featured_card bg-background border-none shadow-none" {...props}>
                    <CardHeader className="py-4 px-0">
                      <CardTitle className="feed__content_featured_card_title text-base">
                         <Skeleton className="h-6 w-20" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="w-2/3 md:w-1/4 lg:w-full flex-wrap">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
     )
}