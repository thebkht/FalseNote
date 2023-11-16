import { formatNumberWithSuffix } from "@/components/format-numbers"
import PostCardSkeleton from "@/components/skeletons/post-card-1"
import PostCardSkeletonV2 from "@/components/skeletons/post-card-2"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
     return (
          <>
               <div className="flex flex-col space-y-6 my-8">
                    <div className="gap-4 px-6 pb-14 w-full flex justify-center items-center flex-col">
                         <Skeleton className="w-1/2 h-12" />
                         <Skeleton className="w-1/4 h-6" />
                         <Skeleton className="w-24 h-10" />
                    </div>
                    <Separator />
                    <div className="flex justify-center w-full">
                         <div className="mx-6 mb-20  w-full">
                              <div className="my-10">
                                   <Skeleton className="h-8 w-20" />
                              </div>
                              <div className="grid md:grid-cols-6 gap-10">
                                   <PostCardSkeleton className="md:col-span-3  col-span-6" />
                                   <PostCardSkeleton className="md:col-span-3  col-span-6" />
                                   <PostCardSkeleton className="lg:col-span-2 md:col-span-3 col-span-6" />
                                   <PostCardSkeleton className="lg:col-span-2 md:col-span-3 col-span-6" />
                                   <PostCardSkeleton className="lg:col-span-2 md:col-span-3 col-span-6" />
                              </div>
                         </div>
                    </div>
                    <Separator />
                    <div className="flex justify-center w-full">
                         <div className="mx-6 mb-20 w-full">
                              <div className="flex justify-between flex-col xl:flex-row">
                                   <div className="min-w-80">
                                        <Skeleton className="h-8 w-20" />
                                   </div>
                                   <div className="flex flex-col xl:max-w-[780px]">
                                        <div className="divide-y">
                                             <PostCardSkeletonV2 />
                                             <Separator />
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}