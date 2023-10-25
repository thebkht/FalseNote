'use server'
import { formatNumberWithSuffix } from "@/components/format-numbers";
import { getSessionUser } from "@/components/get-session-user";
import TagDetails from "@/components/tags/details";
import FollowTagButton from "@/components/tags/follow-btn";
import TagPosts from "@/components/tags/post";
import postgres from "@/lib/postgres";
import { getSession,  } from "next-auth/react";
import { redirect } from "next/navigation";



export default async function TagPage({ params }: { params: { tagname: string } }) {
     const tag = await postgres.tag.findFirst({
          where: {
               name: params.tagname
          },
          include: {
               followingtag: true,
               _count: { select: { posts: true, followingtag: true } }
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
     const session = await getSession().then((res) => res?.user);
     console.log(session);


     console.log(tag);
     return (
          <>
               <div className="flex flex-col space-y-6">
                    <TagDetails tag={tag} post={posts} tagFollowers={tag.followingtag} />
                    <TagPosts posts={posts} tag={tag} session={session} />
               </div>
          </>
     )
}