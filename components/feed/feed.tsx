"use client";
import React, { Suspense } from "react";
import { useSession } from "next-auth/react";
import { Icons } from "../icon";
import { Skeleton } from "../ui/skeleton";
import FeedPostCard from "../blog/feed-post-card";

export default function FeedComponent({ feed, children, isLoaded }: { feed: any; children?: React.ReactNode; isLoaded: boolean; }) {
  const { status, data: session } = useSession();

     return (
      <div className="feed__list">
      {
        isLoaded && feed.length === 0 && (
          <div className="w-full max-h-screen my-auto flex justify-center items-center bg-background">
            <div className="flex flex-col items-center justify-center space-y-4">
              <h1 className="text-2xl font-bold">No posts yet</h1>
              <p className="text-muted-foreground">When you follow someone, their posts will show up here.</p>
            </div>
          </div>
        )
      }

      <div className="feed__list_item">
        {feed.map((post: any) => (
          <Suspense fallback={<Skeleton />} key={post.id}>
            <FeedPostCard
            key={post.id}
            id={post.id as string}
            title={post.title}
            content={post.subtitle}
            date={post.createdAt}
            author={post.author}
            thumbnail={post.cover}
            likes={post.likes}
            comments={post.comments || "0"}
            views={post.views} authorid={post.author?.userid} url={`/${post.author?.username}/${post.url}`} />
          </Suspense>
        ))}


      </div>

      {children}
      {feed.length !== 0 && (
        <div className="feed__list_loadmore my-8">
          {children}
          <Icons.spinner className="h-10 animate-spin mr-2" /> Loading...
        </div>
      )}
    </div>
     )
}