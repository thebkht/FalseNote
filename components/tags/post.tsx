"use client"
import FeedPostCard from "../blog/feed-post-card";

export default function TagPosts({ posts, tag, session }: { posts: any, tag: any, session: any }) {
     return (
          <>
               <div className="grid md:grid-cols-2 gap-4">
                         {posts.map((post: any) => (
                              <FeedPostCard key={post.postid} author={post.author} authorid={post.authorid} content={post.description} date={post.creationdate} comments={post.comment} id={post.postid} likes={post.likes} session={session} title={post.title} url={`/${post.author.username}/${post.url}`} views={post.views} thumbnail={post.coverimage} />
                         ))}
                    </div>
          </>
     )
}