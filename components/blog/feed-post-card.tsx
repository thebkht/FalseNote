import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import TagBadge from "../tags/tag";
import { dateFormat } from "@/lib/format-date";
import ShareList from "../share-list";
import { handlePostSave } from "../bookmark";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";


export default function FeedPostCard(
  props: React.ComponentPropsWithoutRef<typeof Card> & {
    post: any;
    session: any;
    className?: string;
  }
) {
  const pathname = usePathname();
  const save = async (postId: string) => {
    await handlePostSave({ postId, path: pathname });
  }
  const isSaved = props.post?.savedUsers?.some((savedUser: any) => savedUser.userId === props.session?.id);
  return (
    <Card {...props} className={cn("rounded-lg feedArticleCard max-h-72 w-full", props.className)}>
      <CardContent className="py-0 px-0 md:px-4">
        <CardHeader className={cn("pt-4 pb-3 md:pt-6 px-0 gap-y-4")}>
          <div className="flex items-center space-x-1">
            <UserHoverCard user={props.post.author} >
              <Link href={`/@${props.post.author?.username}`} className="flex items-center space-x-0.5">
                <Avatar className="h-6 w-6 mr-0.5 border">
                  <AvatarImage src={props.post.author?.image} alt={props.post.author?.username} />
                  <AvatarFallback>{props.post.author?.name?.charAt(0) || props.post.author?.username?.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-normal leading-none">{props.post.author?.name || props.post.author?.username}</p>
                {props.post.author?.verified && (
                        <Icons.verified className="h-3 w-3 inline fill-primary align-middle" />
                      )}
              </Link>
            </UserHoverCard>
            <span>·</span>
            <span className="!text-muted-foreground text-sm">
              {dateFormat(props.post.createdAt)}
            </span>
          </div>
        </CardHeader>
        <div className="flex">
          <div className="flex-initial w-full">
            <Link href={`/@${props.post.author?.username}/${props.post.url}`}>
              <div>
                <div className="pb-2">
                  <h2 className="text-base md:text-xl font-bold text-ellipsis overflow-hidden post__title">{props.post.title}</h2>
                </div>
                <div className="post-subtitle hidden md:block">
                  <p className="text-ellipsis overflow-hidden line-clamp-3 text-muted-foreground">{props.post.subtitle}</p>
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
                  <p className="card-text mb-0 py-0.5 text-muted-foreground text-xs">{props.post.readingTime}</p>
                </div>
                <div className="stats flex items-center justify-around gap-1">
                  <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                    <Button variant="ghost" size={"icon"} className=" text-muted-foreground">
                      <Bookmark className={`h-5 w-5 ${isSaved && 'fill-current'}`} strokeWidth={2} onClick={() => save(props.post.id)} />
                      <span className="sr-only">Save</span>
                    </Button>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                    <Button variant="ghost" size={"icon"} className=" text-muted-foreground">
                      <ShareList url={`https://falsenotes.netlify.app/@${props.post.author.username}/${props.post.url}`} text={props.post.title}>
                        <div>
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">Share</span>
                        </div>
                      </ShareList>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="flex-none ml-6 md:ml-8">
            <Link href={`/@${props.post.author?.username}/${props.post.url}`}>
              <div className="h-14 md:h-28 bg-muted !relative !pb-0 aspect-[4/3] md:aspect-square overflow-hidden" >
                {props.post.cover ? (
                  <>
                  <Image
                    src={props.post.cover}
                    fill
                    alt={props.post.title}
                    className="object-cover w-full z-[1]"
                  />
                  <Skeleton className="w-full h-full" />
                  </>
                ) : (
                  <Icons.noThumbnail className="h-full" />
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
              <p className="card-text mb-0 py-0.5 text-muted-foreground text-xs">{props.post.readingTime}</p>
            </div>
            <div className="stats flex items-center justify-around gap-1">
              <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                <Button variant="ghost" size={"icon"} className=" text-muted-foreground">
                  <Bookmark className={`h-5 w-5 ${isSaved && 'fill-current'}`} strokeWidth={2} onClick={() => save(props.post.id)} />
                  <span className="sr-only">Save</span>
                </Button>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground text-sm feedpost__action-btn">
                <Button variant="ghost" size={"icon"} className=" text-muted-foreground">
                  <ShareList url={`https://falsenotes.netlify.app/@${props.post.author.username}/${props.post.url}`} text={props.post.title}>
                    <div>
                      <MoreHorizontal className="h-5 w-5" />
                      <span className="sr-only">Share</span>
                    </div>
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

