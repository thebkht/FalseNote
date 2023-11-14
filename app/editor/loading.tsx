import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="grid w-full gap-10 mt-16">
      <div className="mx-auto lg:w-[800px] w-full space-y-6">
        <Skeleton className="h-[50px] w-full" />
        <Skeleton className="h-[20px] w-2/3" />
        <Skeleton className="h-[20px] w-full" />
        <Skeleton className="h-[20px] w-full mb-10" />
        <Skeleton className="h-[20px] w-2/3" />
        <Skeleton className="h-[20px] w-full" />
        <Skeleton className="h-[20px] w-full mb-10" />
        <Skeleton className="h-[20px] w-2/3" />
        <Skeleton className="h-[20px] w-full" />
        <Skeleton className="h-[20px] w-full mb-10" />
      </div>
    </div>
  )
}