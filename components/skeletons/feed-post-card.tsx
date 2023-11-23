import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function PostCardSkeleton(
  { className, ...props }: React.ComponentPropsWithoutRef<typeof Card> & { className?: string; }
) {
  return (
    <Card {...props} className={cn("feedArticleCard bg-background max-h-72 w-full my-4", className
    )}>
      <CardContent className="py-0 px-4">
        <CardHeader className={cn("pt-4 pb-3 md:pt-6 px-0 gap-y-4")}>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-6 w-6 mr-1 md:mr-1.5" />
            <Skeleton className="w-32 h-3" />
          </div>
        </CardHeader>
        <div className="flex justify-between">
          <div className='w-full'>
            <div>
              <div className="pb-3 space-y-2">
                <Skeleton className='w-full h-4' />
                <Skeleton className='w-full h-4 md:hidden' />
              </div>
              <div className="space-y-2 hidden md:block">
                <Skeleton className='w-full h-4' />
                <Skeleton className='w-full h-4' />
              </div>
            </div>
            <div className="py-8">
              <div className="flex justify-between">
                <Skeleton className='w-20 h-3' />
              </div>
            </div>
          </div>
          <Skeleton className="h-14 md:h-28 aspect-[4/3] rounded-md md:aspect-square ml-6 md:ml-8" />
        </div>
      </CardContent>
    </Card>
  )
}