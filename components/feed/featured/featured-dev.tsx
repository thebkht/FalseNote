'use client';

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getSessionUser } from "@/components/get-session-user";
import { useSession } from "next-auth/react";
import { Icons } from "@/components/icon";
import UserHoverCard from "@/components/user-hover-card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { validate } from "@/lib/revalidate";
import { Check, Plus } from "lucide-react";

const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString)
  const currentYear = new Date().getFullYear()
  const year = date.getFullYear()
  const formattedDate = date.toLocaleDateString("en-US", {
       month: "short",
       day: "numeric",
       hour12: true,
  })
  if (year !== currentYear) {
       return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour12: true,
       })
  }
  return formattedDate
}

export default function FeaturedDev(
  { data: featuredDevs, ...props}: { data: any; } & React.ComponentPropsWithoutRef<typeof Card>
) {
  const [isFollowing, setIsFollowing] = useState<boolean[]>(
    featuredDevs?.map(() => false) || []
  );
  const [isFollowingLoading, setIsFollowingLoading] = useState<boolean[]>(
    featuredDevs?.map(() => false) || []
  );
  const { status } = useSession();
  
  const handleFollow = async (followeeId: string, index: number) => {
    if (status === "authenticated") {
      // Create a copy of the loading states array
      const newLoadingStates = [...isFollowingLoading];
      const newFollowingStates = [...isFollowing];
      newLoadingStates[index] = true;
      setIsFollowingLoading(newLoadingStates);

      try {
        const followerId = (await getSessionUser())?.id;
        
        await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
          method: "GET",
        });

        // Reset the loading state for the clicked button
        newFollowingStates[index] = true;
        setIsFollowing(newFollowingStates);
        newLoadingStates[index] = false;
        setIsFollowingLoading(newLoadingStates);
        await validate('/feed');
      } catch (error) {
        console.error(error);

        // Reset the loading state for the clicked button on error
        newLoadingStates[index] = false;
        setIsFollowingLoading(newLoadingStates);
      }
    }
  };

  let content = null;

  if (Array.isArray(featuredDevs)) {
    featuredDevs.length ? content = (
      <Card className={cn("feed__content_featured_card bg-background", props.className)} {...props}>
        <CardHeader className="p-4">
          <CardTitle className="feed__content_featured_card_title text-base">Who to follow</CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <div className="feed__content_featured_card_content flex flex-col items-start justify-between space-y-4">
            {featuredDevs?.map(
                  (item: any, index: number) => (
              <Suspense fallback={<div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full mr-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-36" />
              </div>
          </div>} key={item.id}>
                <div className="flex gap-4 w-full items-center justify-between" key={item.id}>
                <div className="space-y-3">
                <UserHoverCard user={item} >
                <Link href={`/@${item.username}`} className="flex items-center">
                  <Avatar className="mr-1.5 md:mr-2 flex items-center justify-center border bg-muted h-8 w-8">
                    <AvatarImage src={item.image} alt={item.username} />
                    <AvatarFallback>{item.name?.charAt(0) || item.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {
                    !item.name ? (
                      <div>
                        <p className="text-sm font-medium leading-none flex items-center">{item.username} {item?.verified && (
                    <Icons.verified className="h-3 w-3 mx-0.5 inline fill-primary align-middle" />
                    )}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium leading-none flex items-center">{item.name} {item?.verified && (
                    <Icons.verified className="h-3 w-3 mx-0.5 inline fill-primary align-middle" />
                  )}</p>
                        <p className="text-sm text-muted-foreground">{item.username}</p>
                      </div>
                    )
                  }
                </Link>
                </UserHoverCard>
                </div>
                <Button variant={isFollowing[index] ? "secondary" : "outline"} className="flex-shrink-0 h-8 text-sm" onClick={() => {
                          handleFollow(item?.id, index);
                        }}
                        disabled={isFollowingLoading[index]}
                        size={'icon'}
                      >
              {isFollowingLoading[index] ? (
                  <><Icons.spinner className="h-4 w-4 animate-spin" /></>
                ) : (
                  <>{isFollowing[index] ? <><Check className="h-4 w-4" /></> : <><Plus className="h-4 w-4" /></>}</>
                )
              }
            </Button>
              </div>
              </Suspense>
            ))}
          </div>
        </CardContent>
      </Card>
    ) : (
      content = null)
  } else {
    content = null;
  }

  return content;
}
