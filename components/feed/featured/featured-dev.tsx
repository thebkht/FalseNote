import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { featuredItems } from "./items";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { Key } from "react";
import { useEffect, useState } from "react";
import { getFeaturedDevs } from "@/components/get-user";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function FeaturedDev(
  { data: featuredDevs, isloaded: isLoaded, sessionUser }: { data: any; isloaded: boolean; sessionUser: any; }
) {
  async function handleFollow(followeeId: string) {
    const followerId = sessionUser?.userId;
    await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
      method: "POST",
    });
  }

  let content = null;

  if (Array.isArray(featuredDevs)) {
    isLoaded ? content = (
      <Card className="feed__empty_featured_card">
        <CardHeader>
          <CardTitle className="feed__empty_featured_card_title">Featured Devs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="feed__empty_featured_card_content flex flex-col items-start justify-between space-y-4">
            {featuredDevs.map((item: {
              verified: boolean; userId: string; profilepicture: string | undefined; username: string | undefined; name: string | undefined; bio: string | undefined; 
}) => (
              <div className="flex gap-4 w-full items-center justify-between" key={item.userId}>
                <div className="space-y-3">
                <Link href={`/${item.username}`} className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={item.profilepicture} alt={item.username} />
                    <AvatarFallback>{item.name?.charAt(0) || item.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {
                    item.name === null ? (
                      <div>
                        <p className="text-sm font-medium leading-none">{item.username} {item?.verified && (
                    <Badge className="h-3 w-3 !px-0">
                      <Check className="h-2 w-2 mx-auto" />
                    </Badge>
                  )}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium leading-none">{item.name} {item?.verified && (
                    <Badge className="h-3 w-3 !px-0">
                      <Check className="h-2 w-2 mx-auto" />
                    </Badge>
                  )}</p>
                        <p className="text-sm text-muted-foreground">{item.username}</p>
                      </div>
                    )
                  }
                </Link>
                <p className="text-sm hidden md:block w-[410px]">{item?.bio?.length! > 100 ? (
            <>{item?.bio?.slice(0, 100)}...</>
          ) : (
            <>{item.bio}</>
          )}</p>
                </div>
                <Button variant="outline" size={"lg"} className="flex-shrink-0" onClick={() => handleFollow(item.userId)}>
                  <Plus className="h-4 w-4 mr-2" /> Follow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ) : (
      content = <Card className="feed__empty_featured_card">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent>
          <div className="feed__empty_featured_card_content flex flex-col items-start justify-between space-y-4">
            <div className="flex gap-4 w-full items-center justify-between">
              <div className="space-y-3">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full mr-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="flex gap-4 w-full items-center justify-between">
              <div className="space-y-3">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full mr-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="flex gap-4 w-full items-center justify-between">
              <div className="space-y-3">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full mr-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="flex gap-4 w-full items-center justify-between">
              <div className="space-y-3">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full mr-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="flex gap-4 w-full items-center justify-between">
              <div className="space-y-3">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full mr-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>)
  } else {
    content = <div>Loading...</div>;
  }

  return <div className="feed__empty_featured">{content}</div>;
}
