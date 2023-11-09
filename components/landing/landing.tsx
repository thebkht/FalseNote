'use client'
import Image from "next/image";
import LandingPostCard from "../blog/landing-post-card";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { EmptyPlaceholder } from "../empty-placeholder";
import Link from "next/link";
import TagBadge from "../tags/tag";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import { Icons } from "../icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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

export default function Landing({ latest, tags, popular }: { latest: any, tags: any, popular: any }) {
  return (
    <>
      <main className="landing mx-auto w-full overflow-hidden">
        <div className="landing__hero h-screen px-8 xl:px-36 2xl:px-64 border-b">
          <div className="landing__hero_content flex flex-col md:my-24 my-8 space-y-8 md:space-y-24 items-center justify-center">
            <div className="landing_hero-image w-[120vw] md:w-full">
              <Image src="https://falsenotescontent.s3.ap-northeast-2.amazonaws.com/header/header-img.png" sizes="100vw" width={1200} height={600}
                // Make the image display full width
                style={{
                  width: '120vw',
                  height: 'auto',
                }} alt="" />
            </div>
            <div>
              <h1 className="landing__hero_title max-w-[1200px] font-black leading-snug text-5xl md:text-7xl text-center">Start Your Journey with FalseNotes!</h1>
              <p className="landing__hero_description mt-6 mx-auto max-w-[960px] font-medium test-lg md:text-2xl leading-relaxed text-center">🚀 FalseNotes — a platform for Developers to Spark Discussions, Share Expertise, and Shape Coding Journeys.</p>
            </div>
          </div>
        </div>
        <div className="bg-third dark:bg-popover px-8 xl:px-36 2xl:px-64 divide-y">
          <div className="pt-10 pb-4">
            <div className="flex flex-row items-center">
              <h2 className="font-medium mb-4">Treanding on FalseNotes</h2>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-6 w-full">
                {popular?.map((post: any, index: number) => (
                  <div className="col-span-6 md:col-span-3 lg:col-span-2 px-4" key={post.id}>
                    <div className="h-full w-full">
                      <div className="flex items-start mb-6 w-full h-full">
                        <div className="w-10 flex-none relative -top-1.5 mr-4">
                          <span className="font-medium text-3xl text-muted-foreground/50">{index < 9 ? `0${index + 1}` : index + 1}</span>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <UserHoverCard user={post.author} >
                            <Link href={`/${post.author?.username}`} className="flex items-center space-x-0.5">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={post.author?.image} alt={post.author?.username} />
                                <AvatarFallback>{post.author?.name?.charAt(0) || post.author?.username?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <p className="text-sm font-normal leading-none mr-2">{post.author?.name || post.author?.username}</p>
                              {post.author?.verified && (
                                <Icons.verified className="h-3 w-3 inline fill-primary align-middle" />
                              )}
                            </Link>
                          </UserHoverCard>
                          <Link href={`/${post.author?.username}/${post.url}`}>
                            <h2 className="font-extrabold line-clamp-2 max-h-10 text-ellipsis leading-tight tracking-normal">{post.title}</h2>
                          </Link>
                          <span className="text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <span>{dateFormat(post.createdAt)}</span>
                              <div className="px-1">·</div>
                              <span>{post.readingTime}</span>
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid-cols-12 lg:grid flex flex-col-reverse pt-14 grid-rows-1 ">
            <div style={{ 'gridColumn': '1 / span 7' }} className="mt-10 lg:mt-0">
              {latest.length > 0 ? (
                <div className="feed__list">
                  {latest?.map((post: any) => (
                      <LandingPostCard
                      post={post}
                      key={post.id}
                    />
                    ))}
                </div>
              ) : (
                <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name='post' />
                  <EmptyPlaceholder.Title>No posts yet</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>When you follow someone, their posts will show up here.</EmptyPlaceholder.Description>

                </EmptyPlaceholder>
              )}
            </div>
            <div style={{ 'gridColumn': '9 / span 4' }}>
              <div className="sticky lg:top-20 border-b lg:border-b-0">
                {tags.length !== 0 && (
                  <Card className="feed__content_featured_card bg-transparent border-none shadow-none">
                    <CardHeader className="py-4 px-0">
                      <CardTitle className="feed__content_featured_card_title text-base">Discover more of what matchs you</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="w-full flex-wrap">
                        {tags?.map((tag: any) => (
                          <Link href={`/tags/${tag.name}`} key={tag.id}>
                            <TagBadge className="my-2.5 mr-2 py-2 px-4 text-sm font-medium capitalize" variant={"secondary"}>{tag.name.replace(/-/g, " ")}</TagBadge>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="px-0">
                      <Button variant={'link'} className="px-0" asChild>
                        <Link href={`/tags`} className="text-sm flex items-center my-2.5 font-medium">
                          See more tags
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}