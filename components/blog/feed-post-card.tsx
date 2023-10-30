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
import { Bookmark, CalendarDays, Check, Eye, Heart, MessageCircle, User } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import TagBadge from "../tags/tag";


function formatDate(dateString: string | number | Date) {
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  const year = date.getFullYear();

  let formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  if (year !== currentYear) {
    formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  return formattedDate;
}

function dateFormat(dateString: string | number | Date) {
  const date = new Date(dateString)
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentDay = currentDate.getDate()
  const currentHour = currentDate.getHours()
  const currentMinute = currentDate.getMinutes()
  const currentSecond = currentDate.getSeconds()

  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const dayDifference = currentDay - day
  const hourDifference = currentHour - hour
  const minuteDifference = currentMinute - minute
  const secondDifference = currentSecond - second

  //when posted ex: 1 hour ago 1 day ago
  if (dayDifference === 0) {
    if (hourDifference === 0) {
      if (minuteDifference === 0) {
        return `${secondDifference}s`
      }
      return `${minuteDifference}m`
    }
    return `${hourDifference}h`
  }
  //if more than 30 days ago, show date ex: Apr 4, 2021
  if (dayDifference > 30) {
    if (year !== currentYear) {
      return `${date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}`
    }
    return `${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`
  } else {
    return `${dayDifference}d`
  }
}

export default function FeedPostCard(
  props: React.ComponentPropsWithoutRef<typeof Card> & {
    post: any;
  }
) {
  return (
    <Card {...props} className="rounded-lg feedArticleCard bg-background hover:bg-card max-h-72 w-full">
      <CardContent className="px-4 md:px-6 py-0">
        <CardHeader className={cn("pt-4 pb-3 md:pt-6 px-0 gap-y-4")}>
          <div className="flex items-center space-x-1">
            <UserHoverCard user={props.post.author} className="mr-1 md:mr-1.5" >
              <Link href={`/${props.post.author?.username}`} className="flex items-center">
                <Avatar className="h-6 w-6 mr-1 md:mr-1.5">
                  <AvatarImage src={props.post.author?.image} alt={props.post.author?.username} />
                  <AvatarFallback>{props.post.author?.name?.charAt(0) || props.post.author?.username?.charAt(0)}</AvatarFallback>
                </Avatar>
                {
                  props.post.author?.name === null ? (
                    <div>
                      <p className="text-sm font-normal leading-none">{props.post.author?.username} {props.post.author?.verified && (
                        <Badge className="h-3 w-3 !px-0">
                          <Check className="h-2 w-2 mx-auto" />
                        </Badge>
                      )}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-normal leading-none">{props.post.author?.name} {props.post.author?.verified && (
                        <Badge className="h-3 w-3 !px-0">
                          <Check className="h-2 w-2 mx-auto" />
                        </Badge>
                      )}</p>
                    </div>
                  )
                }
              </Link>
            </UserHoverCard>

            <span className="!text-muted-foreground text-sm">
              · {dateFormat(props.post.createdAt)}
            </span>
          </div>
        </CardHeader>
        <div className="flex">
          <div className="flex-initial w-full">
            <Link href={`/${props.post.author?.username}/${props.post.url}`}>
              <div>
                <div className="pb-2">
                  <h2 className="text-base md:text-xl font-bold text-ellipsis overflow-hidden post__title">{props.post.title}</h2>
                </div>
                <div className="post-subtitle hidden md:block">
                  <p className="text-ellipsis overflow-hidden post__subtitle">{props.post.subtitle}</p>
                </div>
              </div>
              </Link>
              <div className="hidden py-8 md:block">
                <div className="flex justify-between items-center">
                  <div className="flex flex-1 items-center space-x-2.5">
                    {
                      props.post.tags?.length > 0 && (
                        <Link href={`/tag/${props.post.tags[0].tag?.name}`} key={props.post.tags[0].tag?.id}>
                          <TagBadge variant={"secondary"} className="flex">
                            {
                              //replace - with space
                              props.post.tags[0].tag?.name.replace(/-/g, " ")
                            }
                          </TagBadge>
                        </Link>
                      )
                    }
                    <p className="card-text mb-0 py-0.5 text-muted-foreground text-xs">{props.post.views} views</p>
                  </div>
                  <div className="stats flex items-center justify-around gap-2">
                    <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                      <Button variant="ghost" size={"icon"} className="h-7 w-7 text-muted-foreground">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <span>{props.post._count.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                      <Button variant="ghost" size={"icon"} className="h-7 w-7 text-muted-foreground">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <span>{props.post._count.savedUsers}</span>
                    </div>
                  </div>
                </div>
              </div>
            
          </div>

          <div className="flex-none ml-6 md:ml-8">
            <Link href={`/${props.post.author?.username}/${props.post.url}`}>
              <div className="h-14 md:h-28 !relative !pb-0 aspect-[4/3] md:aspect-square" >
                {props.post.cover ? (
                  <Image
                    src={props.post.cover}
                    fill
                    alt={props.post.title}
                    className="rounded-md object-cover w-full"
                  />
                ) : (
                  <Icons.noThumbnail className="w-full h-full rounded-md" />
                )}
              </div>
            </Link>


          </div>


        </div>
        <div className="py-4 md:hidden">
          <div className="flex justify-between items-center">
            <div className="flex flex-1 items-center space-x-2.5">
              {
                props.post.tags?.length > 0 && (
                  <Link href={`/tag/${props.post.tags[0].tag?.name}`} key={props.post.tags[0].tag?.id}>
                    <TagBadge variant={"secondary"} className="flex">
                      {
                        //replace - with space
                        props.post.tags[0].tag?.name.replace(/-/g, " ")
                      }
                    </TagBadge>
                  </Link>
                )
              }
              <p className="card-text mb-0 py-0.5 text-muted-foreground text-xs">{props.post.views} views</p>
            </div>
            <div className="stats flex items-center justify-around gap-2">
              <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                <Button variant="ghost" size={"icon"} className="h-7 w-7 text-muted-foreground">
                  <Heart className="w-4 h-4" />
                </Button>
                <span>{props.post._count.likes}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                <Button variant="ghost" size={"icon"} className="h-7 w-7 text-muted-foreground">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <span>{props.post._count.savedUsers}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

