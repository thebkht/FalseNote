import { getSession } from "next-auth/react";
import { getSessionUser } from "@/components/get-session-user";
import { notFound, redirect, useRouter } from "next/navigation";
import postgres from "@/lib/postgres";
import {
  UserDetails,
  UserPosts,
} from "@/components/user";
import UserTab from "@/components/user/tabs";
import { getPost } from "@/lib/prisma/posts";


export default async function Page({ params, searchParams }: {
   params: {
      username: string
   },
   searchParams: { [key: string]: string | string[] | undefined }
 }) {
  const sessionUserName = await getSessionUser();
  const user = await postgres.user.findFirst({
    include: {
      posts: {
        orderBy: {
          createdAt: "desc"
        },
        include: {
          _count: {
            select: {
              likes: true,
              savedUsers: true,
            },
          },
          savedUsers: true,
          tags: {
            take: 1,
            include: {
              tag: true,
            },
          },
        },
        // if user is a session user, show all posts
        where: {
          OR: [
            {
              visibility: "public",
            },
            {
              authorId: sessionUserName?.id,
            },
          ],
        },
      },
      Followers: {
        include: {
          follower: true
        }
      },
      Followings: {
        include: {
          following: true
        }
      }
    },
    where: {
      username: params.username
    }
  })

  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined


  if (!user) notFound();

  const whereQuery = sessionUserName?.id === user?.id ? {} : { visibility: "public" };
  
  const {posts} = await getPost({id: user?.id, search, whereQuery});


  const followers = user.Followers;
  const following = user.Followings;

  const tab = typeof searchParams.tab === 'string' ? searchParams.tab : undefined;
  return (
    <div className="gap-5 lg:gap-6 py-5 flex flex-col md:flex-row items-start" >
      <UserDetails user={user} followers={followers} followings={following} session={sessionUserName} className="w-full md:w-1/3 lg:w-1/4" />
      <UserPosts posts={posts} user={user} sessionUser={sessionUserName} query={whereQuery} search={search} className="w-full">
        {sessionUserName?.id === user?.id && (
          <UserTab user={user} session={sessionUserName} defaultValue={tab} />
        )}
      </UserPosts>
    </div>
  );
}