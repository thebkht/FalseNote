import { getSessionUser } from "@/components/get-session-user";
import TagDetails from "@/components/tags/details";
import TagPosts from "@/components/tags/post";
import postgres from "@/lib/postgres";
import { redirect } from "next/navigation";

export default async function TagPage({ params }: { params: { tagname: string } }) {
     const tag = await postgres.tag.findFirst({
          where: {
               name: params.tagname
          },
          include: {
               followingtag: true,
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

     //if session, check if user is following tag
     if (session) {
          tag.followingtag.find((follower: any) => {
               if (follower.userid === session.userid) {
                    tag.isFollowing = true;
               } else {
                    tag.isFollowing = false;
               }
          }
          )
     } else {
          tag.isFollowing = false;
     }

     console.log(tag);
     return (
          <>
               <div className="flex flex-col space-y-6">
                    <TagDetails tag={tag} post={posts.length} tagFollowers={tag.followingtag} />
                    <TagPosts posts={posts} tag={tag} session={session} />
               </div>
          </>
     )
}