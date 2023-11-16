"use client";
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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icons } from "../icon";
import { Eye, Heart, MessageCircle } from "lucide-react";
import { AspectRatio } from "../ui/aspect-ratio";
import { dateFormat } from "@/lib/format-date";
import { Skeleton } from "../ui/skeleton";


function PostCard(
  props: React.ComponentPropsWithoutRef<typeof Card> & {
    thumbnail?: string;
    title: string;
    content: string;
    author: string;
     date: string;
     views: string;
     comments: string;
     id: string;
     authorid: string;
     session: any;
     likes: string;
     url: string;
     posturl: string;
     className?: string
  },
  
) 
{

  return (
    <Card {...props} className={cn("rounded-lg bg-background hover:bg-card", props.className)}>
      <Link href={props.url}>
      <CardContent className="px-4 md:px-6 py-0">
      <CardHeader className={cn("py-4 md:py-6 px-0 gap-y-2 md:gap-y-4")}>
        {props.thumbnail ? (
          <>
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
          <Skeleton className="w-full h-full rounded-md" />
          </>
        ) : (
          <AspectRatio ratio={16 / 9}>
            <Icons.noThumbnail className="w-full h-full rounded-md" />
          </AspectRatio>
        )}

        <CardTitle className="text-lg md:text-xl">{props.title}</CardTitle>
        <CardDescription className="text-sm md:text-base">
          {props.content && (
            props.content.length! > 150 ? (
              <>{props?.content?.slice(0, 150)}...</>
            ) : (
              <>{props.content}</>
            )
          )}
        </CardDescription>
      </CardHeader>
      <CardFooter className="px-0 justify-between text-sm md:text-base">
        <p className="card-text inline mb-0 text-muted-foreground">{dateFormat(props.date)}</p>
                  <div className="stats flex items-center gap-3">
                    
                    <p className="card-text inline mb-0 text-muted-foreground flex"><Eye className="mr-1 md:h-6 md:w-6 h-5 w-5" /> {props.views}</p>
                    <p className="card-text inline mb-0 text-muted-foreground flex"><MessageCircle className="mr-1 md:h-6 md:w-6 h-5 w-5" /> {props.comments}</p>
                    <p className="card-text inline mb-0 text-muted-foreground flex"><Heart className="mr-1 md:h-6 md:w-6 h-5 w-5" /> {props.likes}</p>
                  </div>
      </CardFooter>
      </CardContent>
      </Link>
    </Card>
  );
}

export default PostCard;
