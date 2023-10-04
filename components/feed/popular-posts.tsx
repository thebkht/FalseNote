import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { featuredItems } from "./featured/items";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { Key } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getSessionUser } from "@/components/get-session-user";
import { useSession } from "next-auth/react";
import { Icons } from "@/components/icon";

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
        const followerId = (await getSessionUser()).userid;
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
      <Card className="feed__content_featured_card">
        <CardHeader className="p-4">
          <CardTitle className="feed__content_featured_card_title text-xl">Trending Now</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ol className="flex flex-col items-start justify-between space-y-4 list-decimal feed__popular-list mx-6">
            {popularPosts.map(
                  (item: any, index: number) => (
              <li key={item.postid} className="text-sm">
                <Link href={`/${item.author.username}/${item.url}`} className="text-base font-medium">
                  {item.title}
                </Link>
                <div className="popular__post-details text-muted-foreground"><span>{item.author.username}</span><span>{formatDate(item.creationdate)}</span></div>
              </li>

            ))}
          </ol>
        </CardContent>
      </Card>
    ) : (
      content = null)
  } else {
    content = <div>Loading...</div>;
  }

  return <div className="feed__empty_featured">{content}</div>;
}
