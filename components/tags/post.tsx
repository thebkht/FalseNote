"use client"
import FeedPostCard from "../blog/feed-post-card";

export default function TagPosts({ posts, tag, session }: { posts: any, tag: any, session: any }) {
     return (
          <>
               <div className="grid md:grid-cols-2 gap-4">
                         {posts.map((post: any) => (
                              <FeedPostCard key={post.id} author={post.author} authorid={post.id} content={post.subtitle} date={post.createdAt} comments={post._count.comments} id={post.id} likes={post._count.likes} session={session} title={post.title} url={`/${post.author.username}/${post.url}`} views={post.views} thumbnail={post.cover} />
                         ))}
                    </div>
          </>
     )
}