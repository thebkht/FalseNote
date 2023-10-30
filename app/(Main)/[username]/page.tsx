import { getSession } from "next-auth/react";
import { getSessionUser } from "@/components/get-session-user";
import { redirect, useRouter } from "next/navigation";
import postgres from "@/lib/postgres";
import {
  UserDetails,
  UserPosts,
} from "@/components/user";
import { getServerSession } from "next-auth";


export default async function Page({ params }: {
   params: {
      username: string
   }
 }) {
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
          tags: {
            take: 1,
            include: {
              tag: true,
            },
          },
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


  const session = await getServerSession();
  console.log(session);
  if (!user) redirect("/404");
  
  const posts = user.posts;

  posts?.forEach((post: any) => {
      post.author = user;
  })

  const followers = user.Followers;
  const following = user.Followings;

  const sessionUserName = await getSessionUser();
  
  return (
    <div className="Layout Layout--flowRow-until-md gap-2 lg:gap-6" >
      <UserDetails user={user} followers={followers} followings={following} />
      <UserPosts posts={posts} className="row-span-2 md:col-span-2" user={user} sessionUser={sessionUserName} />
    </div>
  );
}