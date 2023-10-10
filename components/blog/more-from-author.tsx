
import UserPostCard from "../user/post-card";

export default function MoreFromAuthor({ author, post, sessionUser }: { author: any, post: any, sessionUser: any }) {
     console.log("posts:", post)
     return (
          <>
                          {
                              post && (
                                   <>
                                        <div className="text-2xl font-bold mb-4">More From {author?.username}</div>
                         <div className="grid md:grid-cols-2 gap-4">
                              {
                                   post?.map((p: any) => (
                                        <UserPostCard key={p.postid} post={p} sessionUser={sessionUser} user={author}  />
                                   ))
                              }
                         </div>
                                   </>)
                          }
          </>
     )
}