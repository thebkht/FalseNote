import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Bookmark, CalendarDays, Check, Eye, Heart, MessageCircle, MoreHorizontal, Share, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import TagBadge from "../tags/tag";
import ShareList from "../share-list";
import { handlePostSave } from "../bookmark";
import { usePathname } from "next/navigation";
import { getSessionUser } from "../get-session";
import { formatNumberWithSuffix } from "../format-numbers";

export function dateFormat(dateString: string | number | Date) {
  const date = new Date(dateString);
  const currentDate = new Date();

  const differenceInTime = currentDate.getTime() - date.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  if (differenceInDays < 1) {
    const differenceInHours = differenceInTime / (1000 * 3600);
    if (differenceInHours < 1) {
      const differenceInMinutes = differenceInTime / (1000 * 60);
      if (differenceInMinutes < 1) {
        const differenceInSeconds = differenceInTime / 1000;
        return differenceInSeconds < 1 ? 'Just now': `${Math.floor(differenceInSeconds)}s`;
      }
      return `${Math.floor(differenceInMinutes)}m`;
    }
    return `${Math.floor(differenceInHours)}h`;
  }

  if (differenceInDays > 30) {
    return `${date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })}`;
  } else {
    return `${Math.floor(differenceInDays)}d`;
  }
}

export default function LandingPostCard(
  props: React.ComponentPropsWithoutRef<typeof Card> & {
    post: any;
    className?: string | undefined;
  }
) {
  return (
    <Card {...props} className={cn("rounded-lg feedArticleCard bg-transparent max-h-72 w-full border-none shadow-none", props.className)}>
      <CardContent className="py-0 px-0 md:px-4">
        <div className="flex items-start mb-8 md:mb-12">
          <div className="flex-initial w-full">
          <div className="flex items-center space-x-1 mb-2">
            <UserHoverCard user={props.post.author} >
              <Link href={`/${props.post.author?.username}`} className="flex items-center space-x-0.5">
                <Avatar className="h-6 w-6 mr-0.5">
                  <AvatarImage src={props.post.author?.image} alt={props.post.author?.username} />
                  <AvatarFallback>{props.post.author?.name?.charAt(0) || props.post.author?.username?.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-normal leading-none">{props.post.author?.name || props.post.author?.username}</p>
                {props.post.author?.verified && (
                  <Icons.verified className="h-3 w-3 inline fill-primary align-middle" />
                )}
              </Link>
            </UserHoverCard>
          </div>
            <Link href={`/${props.post.author?.username}/${props.post.url}`}>
              <div>
                <div className="pb-2">
                  <h2 className="text-base md:text-xl font-bold text-ellipsis overflow-hidden post__title">{props.post.title}</h2>
                </div>
                <div className="post-subtitle hidden md:block">
                  <p className="text-ellipsis overflow-hidden line-clamp-2 text-muted-foreground">{props.post.subtitle}</p>
                </div>
              </div>
            </Link>
            <div className="mt-1">
              <div className="flex justify-between items-center">
                <div className="flex flex-1 items-center space-x-1.5">

                  <span className="!text-muted-foreground text-sm">
                    {dateFormat(props.post.createdAt)}
                  </span>
                  <span>·</span>
                  <p className="card-text mb-0 text-muted-foreground text-xs">{props.post.readingTime}</p>
                  <span>·</span>
                  {
                    props.post.tags?.length > 0 && (
                      <Link href={`/tags/${props.post.tags[0].tag?.name}`} key={props.post.tags[0].tag?.id}>
                        <TagBadge variant={"secondary"} className="flex">
                          {
                            //replace - with space
                            props.post.tags[0].tag?.name.replace(/-/g, " ")
                          }
                        </TagBadge>
                      </Link>
                    )
                  }

                </div>
                <div className="stats flex items-center justify-around gap-1">
                  <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                    <Button variant="ghost" size={"icon"} className=" text-muted-foreground">
                      <Bookmark className={`h-5 w-5 `} strokeWidth={2} />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-none ml-5">
            <Link href={`/${props.post.author?.username}/${props.post.url}`}>
              <div className="h-[100px] md:h-36 !relative !pb-0 md:aspect-[4/3] aspect-square" >
                {props.post.cover ? (
                  <Image
                    src={props.post.cover}
                    fill
                    alt={props.post.title}
                    className="object-cover w-full"
                  />
                ) : (
                  <Icons.noThumbnail className="w-full h-full" />
                )}
              </div>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
