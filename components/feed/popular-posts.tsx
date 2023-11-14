import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import { Skeleton } from "../ui/skeleton";
import { fetchPosts } from "./get-posts";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Check } from "lucide-react";
import { Badge } from "../ui/badge";
import { Icons } from "../icon";
import { getPosts } from "@/lib/prisma/posts";

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

export default async function PopularPosts() {
  const { posts } = await getPosts({limit: 3})
  let content = null;

  posts ? content = (
    posts.length !== 0 && (
      <Card className="feed__content_featured_card bg-background border-none shadow-none">
        <CardHeader className="py-4 px-0">
          <CardTitle className="feed__content_featured_card_title text-base">Trending Now</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ol className="flex flex-col items-start justify-between space-y-4">
            {posts.map(
              (item: any, index: number) => (
                <li key={item.id} className="text-sm space-y-2.5">

                  <Link href={`/${item.author.username}`} className="text-xs flex items-center mb-2 font-medium">
                    <Avatar className="h-5 w-5 mr-1 md:mr-1.5 border">
                      <AvatarImage src={item.author?.image} alt={item.author?.username} />
                      <AvatarFallback>{item.author?.name?.charAt(0) || item.author?.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {item.author.name || item.author.username} {item.author?.verified && (
                      <Icons.verified className="h-3 w-3 mx-0.5 inline fill-primary align-middle" />
                    )}
                  </Link>


                  <Link href={`/${item.author.username}/${item.url}`} className="text-base font-bold line-clamp-2 overflow-hidden leading-tight">
                    {item.title}
                  </Link>
                </li>
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

  return content;
}
