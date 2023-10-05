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
import { Icons } from "../icon";
import { useSession } from "next-auth/react";
import { CalendarDays, Check, Eye, Heart, MessageCircle, User } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import UserHoverCard from "../user-hover-card";


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
    thumbnail?: string;
    title: string;
    content: string;
    author: any;
    date: string;
    views: string;
    comments: string;
    id: string;
    authorid: string;
    session: any;
    likes: string;
    url: string;
  }
) {
  return (
  <Card {...props} className="rounded-lg feedArticleCard bg-background hover:bg-card">
            <Link href={props.url}>
              <CardContent className="px-4 md:px-6 py-0">
                <CardHeader className={cn("py-4 md:py-6 px-0 gap-y-4")}>
                  <div className="flex items-start justify-between">
                  <UserHoverCard user={props.author} >
                  <Link href={`/${props.author?.username}`} className="flex items-center">
                      <Avatar className="h-10 w-10 mr-2 md:mr-3">
                        <AvatarImage src={props.author?.profilepicture} alt={props.author?.username} />
                        <AvatarFallback>{props.author?.name?.charAt(0) || props.author?.username?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {
                        props.author?.name === null ? (
                          <div>
                            <p className="text-sm font-medium leading-none">{props.author?.username} {props.author?.verified && (
                              <Badge className="h-3 w-3 !px-0">
                                <Check className="h-2 w-2 mx-auto" />
                              </Badge>
                            )}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium leading-none">{props.author?.name} {props.author?.verified && (
                              <Badge className="h-3 w-3 !px-0">
                                <Check className="h-2 w-2 mx-auto" />
                              </Badge>
                            )}</p>
                            <p className="text-sm text-muted-foreground">{props.author?.username}</p>
                          </div>
                        )
                      }
                    </Link>
                    </UserHoverCard>
                    
                    <span className="!text-muted-foreground">
                      {dateFormat(props.date)}
                    </span>
                  </div>

                  {props.thumbnail && (
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={props.thumbnail}
                        fill
                        alt={props.title}
                        className="rounded-md
            object-cover
            w-full
            "
                      />
                    </AspectRatio>
                  )}

                  <CardTitle className="">{props.title}</CardTitle>
                  <CardDescription className="text-base">
                    {props.content && ( props.content + "..." )}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="px-0 justify-center">
                  <div className="stats flex items-center justify-around gap-3">
                    <p className="card-text inline mb-0 text-muted-foreground flex"><Eye className="mr-1" /> {props.views}</p>
                    <p className="card-text inline mb-0 text-muted-foreground flex"><MessageCircle className="mr-1" /> {props.comments}</p>
                    <p className="card-text inline mb-0 text-muted-foreground flex"><Heart className="mr-1" /> {props.likes}</p>
                  </div>
                </CardFooter>
              </CardContent>
            </Link>
          </Card>
  );
}

