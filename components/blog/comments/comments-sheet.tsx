import {
     Sheet,
     SheetContent,
     SheetDescription,
     SheetHeader,
     SheetTitle,
     SheetTrigger,
} from "@/components/ui/sheet"

import React, { useEffect, useState } from "react";
import CommentForm from "./comment-form";
import UserHoverCard from "@/components/user-hover-card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Markdown from "markdown-to-jsx";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useWindowDimensions from "@/components/window-dimensions";
import { Icons } from "@/components/icon";

const formatDate = (dateString: string | number | Date) => {
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

export default function CommentsSheet({ post, comments, children, session, ...props }: React.ComponentPropsWithoutRef<typeof Sheet> & { post: any, comments: any, children: React.ReactNode, session: any }) {
     const [commentsRef, setComments] = React.useState<any>(comments);
     useEffect(() => {
          setComments(comments);
     }, [comments])
     const { width, height } = useWindowDimensions();

     return (
          <Sheet {...props}>
               <SheetTrigger>{children}</SheetTrigger>
               <SheetContent className="p-0 md:w-[400px] md:h-full h-3/4 md:rounded-none rounded-md" side={width ? (width <= 640 ? "bottom" : "right") : "right"}>
                    <ScrollArea className="flex flex-col p-6 w-full h-full">
                    <SheetHeader>
                         <SheetTitle>Comments</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col">
                         <CommentForm session={session} post={post} />
                         <div className="article__comments-list divide-y my-4">
                              {
                                   commentsRef?.map((comment: any) => (
                                        <div className="article__comments-item flex gap-3 space-y-3" key={comment.id}>
                                             <Card className="article__comments-item-card w-full bg-background border-none shadow-none">
                                                  <CardHeader className="space-y-0 w-full text-sm flex-row items-center p-4">
                                                       <UserHoverCard user={comment.author} className="h-6 w-6 mr-1 md:mr-1.5" >
                                                            <Link href={`/${comment.author.username}`} className="inline-block">
                                                                 <Avatar className="h-6 w-6">
                                                                      <AvatarImage src={comment.author.image} alt={comment.author.name} />
                                                                      <AvatarFallback>{comment.author.name ? comment.author.name.charAt(0) : comment.author.username.charAt(0)}</AvatarFallback>
                                                                 </Avatar>
                                                            </Link>
                                                       </UserHoverCard>
                                                       <Link href={`/${comment.author.username}`} className="flex items-center">
                                                            <span className="article__comments-item-author text-sm">{comment.author.name || comment.author.username}</span>
                                                            {comment.author?.verified &&
                                                            (
                                                                 <Icons.verified className="h-4 w-4 mx-1 inline fill-primary align-middle" />
                                                            )}
                                                            {comment.author?.id === post?.authorId && (
                                                                 <Badge className="ml-1 text-[10px] py-0">Author</Badge>
                                                            )}
                                                       </Link>
                                                       <span className="mx-1.5 !mt-0 text-sm">·</span>
                                                       <span className="article__comments-item-date text-muted-foreground text-sm !mt-0">{formatDate(comment.createdAt)}</span>
                                                  </CardHeader>
                                                  <CardContent className="p-4 pt-0">

                                                       <div className="article__comments-item-body text-sm prose-neutral markdown-body dark:prose-invert prose-img:rounded-xl prose-a:text-primary prose-code:bg-muted prose-pre:bg-muted prose-code:text-foreground prose-pre:text-foreground !max-w-full prose lg:prose-xl">
                                                            <Markdown>{comment.content}</Markdown>
                                                       </div>
                                                  </CardContent>
                                             </Card>

                                        </div>
                                   ))
                              }
                         </div>
                    </div>
                    </ScrollArea>
               </SheetContent>
          </Sheet>

     )
}