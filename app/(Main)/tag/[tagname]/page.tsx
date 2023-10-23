import { formatNumberWithSuffix } from "@/components/format-numbers";
import { getSessionUser } from "@/components/get-session-user";
import LoginDialog from "@/components/login-dialog";
import FollowTagButton from "@/components/tags/follow-btn";
import TagPosts from "@/components/tags/post";
import { Button, buttonVariants } from "@/components/ui/button";
import postgres from "@/lib/postgres";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function TagPage({ params }: { params: { tagname: string } }) {
     const tag = await postgres.tag.findFirst({
          where: {
               name: params.tagname
          },
          include: {
               followingtag: true,
          },
          orderBy: {
               posts: {
                    _count: 'desc'
               }
          }
     })
     if (!tag) redirect("/404");
     const posts = await postgres.post.findMany({
          where: {
               visibility: 'public',
               tags: {
                    some: {
                         id: tag.id
                    }
               }
          },
          include: {
               author: true,
               _count: { select: { comments: true, likes: true, savedUsers: true } }
          }
     });
     const session = await getSessionUser();
     const sessionStatus = session ? "authenticated" : "unauthenticated";

     const isFollowing = tag.followingtag.some((user) => user.id === session?.id);

     const handleFollow = () => async () => {
          if (isFollowing) {
               await postgres.tagFollow.deleteMany({
                    where: {
                         followerId: session?.id,
                         tagId: tag.id
                    }
               })
          } else {
               await postgres.tagFollow.create({
                    data: {
                         followerId: session?.id,
                         tagId: tag.id
                    }
               })
          }
     }

     console.log(tag);
     return (
          <>
               <div className="flex flex-col space-y-6">
                    <div className="space-y-0.5 px-6 pb-14 w-full">
                         <h2 className="text-5xl font-medium tracking-tight w-full capitalize text-center">{tag.name.replace(/-/g, " ")}</h2>
                         <div className="text-muted-foreground pt-4 pb-6 flex justify-center">
                              Tag<div className="mx-2">·</div>{formatNumberWithSuffix(posts.length)} Posts<div className="mx-2">·</div>{formatNumberWithSuffix(tag.followingtag.length)} Followers
                         </div>
                         {/* <div className="w-full flex justify-center">
                              {
                                   sessionStatus === "authenticated" ? (
                                        <form action={handleFollow}>
                                             <FollowTagButton variant={"secondary"} size={"lg"} isFollowing={isFollowing}/>
                                        </form>

                                   ) : (
                                        <LoginDialog>
                                             <div className={cn(buttonVariants)}><span>Follow</span></div>
                                        </LoginDialog>
                                   )
                              }
                         </div> */}
                    </div>
                    <TagPosts posts={posts} tag={tag} session={session} />
               </div>
          </>
     )
}