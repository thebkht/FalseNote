
import PostCardSkeletonV2 from "@/components/skeletons/post-card-1";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="md:container mx-auto px-4 pt-5">
        <div className="gap-5 lg:gap-6 flex flex-col md:flex-row items-start xl:px-4 pt-5" >
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className={"flex flex-col items-stretch justify-between xs:h-fit details"}>
              <div className="flex-1">
                <div className="flex lg:flex-col items-start">
                  <div className="user__header flex md:block md:items-start lg:space-y-4 space-y-2 pb-4" />
                  <div className="flex items-center md:py-4 w-full justify-between">
                    <div className="md:space-y-3 w-full">
                      <Skeleton className="w-full h-8" />
                      <Skeleton className="w-28 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              <Skeleton className="w-full h-9" />

              <div className="w-full mt-5 space-x-0.5">
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-full h-5" />
              </div>

              <div className="py-4 items-center flex gap-2 w-full">
                <Skeleton className="w-20 h-8" />
                <Skeleton className="w-20 h-8" />
              </div>

              <ul className="details list-none">
                <Skeleton className="w-32 h-5" />
                <Skeleton className="w-32 h-5" />
                <Skeleton className="w-32 h-5" />
              </ul>
            </div>
          </div>
          <div className="lg:pl-8 w-full">
            <div className="user-articles lg:mb-6 md:mb-5 mb-4">
              <div className="flex flex-col lg:gap-6 md:gap-5 gap-4">
                <PostCardSkeletonV2 />
                <PostCardSkeletonV2 />
                <PostCardSkeletonV2 />
                <PostCardSkeletonV2 />
                <PostCardSkeletonV2 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}