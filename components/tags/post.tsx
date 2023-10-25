"use client"
import { useSession } from "next-auth/react";
import FeedPostCard from "../blog/feed-post-card";

export default function TagPosts({ posts, tag }: { posts: any, tag: any }) {
     const { status: sessionStatus } = useSession();
     if (sessionStatus !== "authenticated") return null;
     return (
          <>
               <div className="grid md:grid-cols-2 gap-4">
                         {posts.map((post: any) => (
                              <FeedPostCard key={post.id} author={post.author} authorid={post.id} content={post.subtitle} date={post.createdAt} comments={post._count.comments} id={post.id} likes={post._count.likes} title={post.title} url={`/${post.author.username}/${post.url}`} views={post.views} thumbnail={post.cover} />
                         ))}
                    </div>
          </>
     )
}