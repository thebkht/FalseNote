"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { getSessionUser } from "@/components/get-session-user";
import { useSession } from "next-auth/react";
import { formatNumberWithSuffix } from "../format-numbers";
import { Skeleton } from "../ui/skeleton";

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

export default function PopularPosts(
  { data: popularPosts, isloaded: isLoaded}: { data: any; isloaded: boolean; }
) {
  const [isFollowing, setIsFollowing] = useState<boolean[]>(
    popularPosts?.map(() => false) || []
  );
  const [isFollowingLoading, setIsFollowingLoading] = useState<boolean[]>(
    popularPosts?.map(() => false) || []
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
        const followerId = (await getSessionUser()).id;
        await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
          method: "GET",
        });

        // Reset the loading state for the clicked button
        newFollowingStates[index] = true;
        setIsFollowing(newFollowingStates);
        newLoadingStates[index] = false;
        setIsFollowingLoading(newLoadingStates);
      } catch (error) {
        console.error(error);

        // Reset the loading state for the clicked button on error
        newLoadingStates[index] = false;
        setIsFollowingLoading(newLoadingStates);
      }
    }
  };

  let content = null;

  if (Array.isArray(popularPosts)) {
    isLoaded ? content = (
      popularPosts.length !== 0 && (
        <Card className="feed__content_featured_card">
        <CardHeader className="p-4">
          <CardTitle className="feed__content_featured_card_title text-xl">Trending Now</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ol className="flex flex-col items-start justify-between space-y-4 feed__popular-list">
            {popularPosts.map(
                  (item: any, index: number) => (
              <Suspense fallback={<div className="space-y-2 w-full"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-36" /></div>} key={item.id}>
                <li key={item.id} className="text-sm">
                <Link href={`/${item.author.username}/${item.url}`} className="text-base font-medium">
                  {item.title}
                </Link>
                <div className="popular__post-details text-muted-foreground"><span>{item.author.username}</span><span>{formatDate(item.createdAt)}</span><span>{formatNumberWithSuffix(item.views) } views</span></div>
              </li>
              </Suspense>
            ))}
          </ol>
        </CardContent>
      </Card>
      )
    ) : (
      content = (
        <Card className="feed__empty_featured_card bg-background">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent>
        <div className="space-y-4">
        <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-36" />
          </div>
        <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-36" />
          </div>
        <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-36" />
          </div>
        </div>
        </CardContent>
      </Card>
      ))
  } else {
    content = <div>Loading...</div>;
  }

  return content;
}
