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
import { Bookmark, CalendarDays, Check, Eye, Heart, MessageCircle, Share, User } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import TagBadge from "../tags/tag";
import { dateFormat } from "@/lib/format-date";
import ShareList from "../share-list";
import { handlePostSave } from "../bookmark";
import { usePathname } from "next/navigation";
import { getSessionUser } from "../get-session";
import { formatNumberWithSuffix } from "../format-numbers";


export default function FeedPostCard(
  props: React.ComponentPropsWithoutRef<typeof Card> & {
    post: any;
    session: any;
  }
) {
  const pathname = usePathname();
  const save = async (postId: number) => {
    await handlePostSave({ postId, path: pathname });
  }
  const isSaved = props.post?.savedUsers?.some((savedUser: any) => savedUser.userId === props.session?.id);
  return (
    <Card {...props} className="rounded-lg feedArticleCard bg-background max-h-72 w-full border-none shadow-none">
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
                  <p className="text-ellipsis overflow-hidden line-clamp-3">{props.post.subtitle}</p>
                </div>
              </div>
            </Link>
            <div className="hidden py-8 md:block">
              <div className="flex justify-between items-center">
                <div className="flex flex-1 items-center space-x-2.5">
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
                  <p className="card-text mb-0 py-0.5 text-muted-foreground text-xs">{formatNumberWithSuffix(props.post.views)} views</p>
                </div>
                <div className="stats flex items-center justify-around gap-1">
                  <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                    <Button variant="ghost" size={"icon"} className=" text-muted-foreground">
                      <Bookmark className={`h-5 w-5 ${isSaved && 'fill-current'}`} strokeWidth={2} onClick={() => save(props.post.id)} />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                    <Button variant="ghost" size={"icon"} className=" text-muted-foreground">
                      <ShareList url={props.post.url} text={props.post.title}>
                        <Share className="h-5 w-5" />
                      </ShareList>
                    </Button>
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
                    className="object-cover w-full"
                  />
                ) : (
                  <Icons.noThumbnail className="w-full h-full" />
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
            <div className="stats flex items-center justify-around gap-1">
              <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                <Button variant="ghost" size={"icon"} className=" text-muted-foreground">
                  <Bookmark className={`h-5 w-5 ${isSaved && 'fill-current'}`} strokeWidth={2} onClick={() => save(props.post.id)} />
                </Button>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                <Button variant="ghost" size={"icon"} className=" text-muted-foreground">
                  <ShareList url={props.post.url} text={props.post.title}>
                    <Share className="h-5 w-5" />
                  </ShareList>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

