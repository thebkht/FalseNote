import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import { Skeleton } from "../ui/skeleton";
import { fetchPosts } from "./get-posts";

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
  const posts = await fetchPosts();
  let content = null;

  posts ? content = (
    posts.length !== 0 && (
      <Card className="feed__content_featured_card">
        <CardHeader className="p-4">
          <CardTitle className="feed__content_featured_card_title text-xl">Trending Now</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ol className="flex flex-col items-start justify-between space-y-4 feed__popular-list">
            {posts.map(
              (item: any, index: number) => (
                <li key={item.id} className="text-sm">
                    <Link href={`/${item.author.username}/${item.url}`} className="text-base font-medium">
                      {item.title}
                    </Link>
                    <div className="popular__post-details text-muted-foreground"><span>{item.author.username}</span><span>{formatDate(item.createdAt)}</span><span>{formatNumberWithSuffix(item.views)} views</span></div>
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
