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
      },
      Followers: {
        include: {
          following: true
        }
      },
      Followings: {
        include: {
          follower: true
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
  const postComments = await postgres.comment.findMany({
    where: {
      postId: {
        in: posts.map((post: any) => post.id)
      }
    }
  });

  posts?.forEach((post: any) => {
      postComments?.forEach((comment: any) => {
        if (comment.postid === post.postid) {
          post.comments = post.comments + 1;
        }
      }
      )
    }
    )
  const followers = user.Followers;
  const following = user.Following;

  const sessionUserName = await getSession();
  console.log(sessionUserName);
  
  return (
    <div className="Layout Layout--flowRow-until-md gap-2 lg:gap-6" >
      <UserDetails user={user} followers={followers} followings={following} />
      <UserPosts posts={posts} className="row-span-2 md:col-span-2" user={user} sessionUser={sessionUserName} />
    </div>
  );
}