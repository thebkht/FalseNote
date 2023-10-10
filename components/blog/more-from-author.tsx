
import { formatNumberWithSuffix } from "../format-numbers";
import UserPostCard from "../user/post-card";
import PostCard from "./post-card";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function MoreFromAuthor({ author, post, sessionUser }: { author: any, post: any, sessionUser: any }) {
     console.log("posts:", post)
     return (
          <>
                          {
                              post.length !== 0 && (
                                  <>
                                    <Separator className="my-8" />
                                   <div className="max-w-[65ch] lg:text-xl mx-auto">
                                        <div className="author__details flex flex-col gap-y-4">
                                             <Avatar className="h-20 w-20">
                                                  <AvatarImage src={author?.profilepicture} alt={author?.username} />
                                                  <AvatarFallback>{author?.username.charAt(0)}</AvatarFallback>
                                             </Avatar>
                                             <div className="flex">
                                             <div className="flex flex-col gap-y-2">
                                             <span className="text-2xl font-medium">Written by {author?.name || author?.username}</span>
                                             <span className="text-sm font-normal">{formatNumberWithSuffix(author?.followers || 0)} Followers</span>
                                             </div>
                                             <Button variant={"secondary"} className="ml-auto" size={"lg"}>Follow</Button>
                                             </div>
                                             {author?.bio && ( <span className="text-sm font-normal">{author?.bio}</span> )}
                                             <div className="text-base font-medium mb-4">More From {author?.username}</div>
                         <div className="grid md:grid-cols-2 gap-4">
                              {
                                   post?.map((p: any) => (
                                        <PostCard
                                             key={p.postid}
                                             title={p.title}
                                             thumbnail={p.coverimage}
                                             content={p.description}
                                             author={author?.username || author?.name}
                                             date={p.creationdate}
                                             views={formatNumberWithSuffix(p.views)}
                                             comments={formatNumberWithSuffix(p.comments || 0)}
                                             id={p.id}
                                             authorid={author?.userid}
                                             session={sessionUser}
                                             likes={formatNumberWithSuffix(p.likes || 0)}
                                             url={`/${author?.username}/${p.url}`}
                                             posturl={p.url} className="bg-transparent !border-none hover:bg-transparent"/>
                                   ))
                              }
                         </div>
                                        </div>
                                   </div>
                                  </>
                                   )
                          }
          </>
     )
}