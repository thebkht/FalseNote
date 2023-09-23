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
import { Eye, Heart, MessageCircle } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

function formatDate(dateString: string | number | Date) {
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  const year = date.getFullYear();
  
  let formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  if (year !== currentYear) {
    formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  return formattedDate;
}


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
  }
) 
{
  return (
    <Card {...props}>
      <CardHeader className={cn("flex flex-col gap-y-2")}>
        {props.thumbnail && (
          <AspectRatio ratio={16 / 9}>
            <Image
            src={props.thumbnail}
            width={200}
            height={200}
            alt="thumbnail"
            className="rounded-md
            object-cover
            w-full
            "
          />
          </AspectRatio>
        )}

        <CardTitle>{props.title}</CardTitle>
        <CardDescription>
          {props.content.length! > 100 ? (
            <>{props?.content?.slice(0, 100)}...</>
          ) : (
            <>{props.content}</>
          )}
        </CardDescription>
      </CardHeader>
      <CardFooter>
                  <div className="stats flex items-center gap-3">
                    <p className="card-text inline mb-0 text-muted-foreground">{formatDate(new Date(props.date).toLocaleString())}</p>
                    <p className="card-text inline mb-0 text-muted-foreground flex"><Eye className="mr-1" /> {props.views}</p>
                    <p className="card-text inline mb-0 text-muted-foreground flex"><MessageCircle className="mr-1" /> {props.comments}</p>
                    <p className="card-text inline mb-0 text-muted-foreground flex"><Heart className="mr-1" /> {props.likes}</p>
                  </div>
      </CardFooter>
    </Card>
  );
}

export default PostCard;