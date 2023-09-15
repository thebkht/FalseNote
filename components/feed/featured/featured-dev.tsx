import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { featuredItems } from "./items";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Key } from "react";
import { useEffect, useState } from "react";
import { getFeaturedDevs } from "@/components/get-user";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedDev() {
  const [featuredDevs, setFeaturedDevs] = useState([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getFeaturedDevs();
        setFeaturedDevs(userData.users);
        setIsLoaded(true);
      } catch (error) {
        // Handle errors
        console.error('Error:', error);
      }
    }

    fetchData();
  }, []);

  let content = null;

  if (Array.isArray(featuredDevs)) {
    isLoaded ? content = (
      <Card className="feed__empty_featured_card">
        <CardHeader>
          <CardTitle className="feed__empty_featured_card_title">Featured Devs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="feed__empty_featured_card_content flex flex-col items-start justify-between space-y-4">
            {featuredDevs.map((item: { userId: Key | null | undefined; profilepicture: string | undefined; username: string | undefined; name: string | undefined; bio: string | undefined; }) => (
              <div className="flex gap-4 w-full items-center justify-between" key={item.userId}>
                <Link href={`/${item.username}`} className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={item.profilepicture} alt={item.username} />
                    <AvatarFallback>{item.name?.charAt(0) || item.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {
                    item.name === null ? (
                      <div>
                        <p className="text-sm font-medium leading-none">@{item.username}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium leading-none">{item.name}</p>
                        <p className="text-sm text-muted-foreground">@{item.username}</p>
                      </div>
                    )
                  }
                </Link>
                <p className="text-sm text-muted-foreground hidden md:block">{item.bio}</p>
                <Button variant="outline" size={"lg"} className="flex-shrink-0">
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
