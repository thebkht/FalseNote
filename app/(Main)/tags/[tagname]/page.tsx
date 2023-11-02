'use server'
import { getSessionUser } from "@/components/get-session-user";
import TagDetails from "@/components/tags/details";
import TagLatestPosts from "@/components/tags/latest-posts";
import TagPopularPosts from "@/components/tags/post";
import { Separator } from "@/components/ui/separator";
import postgres from "@/lib/postgres";
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
     const popularPosts = await postgres.post.findMany({
          where: {
               visibility: 'public',
               tags: {
                    some: {
                         tagId: tag.id
                    }
               }
          },
          include: {
               author: {
                    include: {
                         Followers: true,
                         Followings: true,
                    }
               },
               _count: { select: { comments: true, likes: true, savedUsers: true } },
               tags: {
                    include: {
                         tag: true
                    }
               }
          },
          orderBy: {
               views: 'desc'
          }, 
          take: 8
     });
     const latestPosts = await postgres.post.findMany({
          where: {
               visibility: 'public',
               tags: {
                    some: {
                         tagId: tag.id
                    }
               }
          },
          include: {
               author: {
                    include: {
                         Followers: true,
                         Followings: true,
                    }
               },
               _count: { select: { comments: true, likes: true, savedUsers: true } },
               savedUsers: true,
          },
          orderBy: {
               createdAt: 'desc'
          }, 
          take: 5
     });

     const session = await getSessionUser();
     return (
          <>
               <div className="flex flex-col space-y-6 my-8">
                    <TagDetails tag={tag} tagFollowers={tag.followingtag} session={session} />
                    <Separator />
                    <TagPopularPosts posts={popularPosts} tag={tag} session={session} />
                    <Separator />
                    <TagLatestPosts posts={latestPosts} tag={tag} session={session} />
               </div>
          </>
     )
}