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
          <Image
            src="/no-thumbnail.jpg"
            width={200}
            height={200}
            alt="thumbnail"
            className="rounded-md
            object-cover
            w-full
            "
          />
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
      {props.session?.userid === props.authorid && (
                    <div className="action-btn">
                      <a href={`#`} className="btn btn-success">Edit</a>
                      <a href={`#`} className="btn btn-danger">Delete</a>
                    </div>
                  )}
                  <div className="stats flex items-center gap-3">
                    <p className="card-text inline mb-0">{new Date(props.date).toLocaleString()}</p>
                    <p className="card-text inline mb-0 text-muted"><Eye className="mr-1" /> {props.views}</p>
                    <p className="card-text inline mb-0 text-muted"><MessageCircle className="mr-1" /> {props.comments}</p>
                    <p className="card-text inline mb-0 text-muted"><Heart className="mr-1" /> {props.likes}</p>
                  </div>
      </CardFooter>
    </Card>
  );
}

export default PostCard;