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
  const rows = await postgres.user.findMany({
    include: {
      posts: true,
      Followers: true,
      Following: true
    },
    where: {
      username: params.username
    }
  })


  const session = await getServerSession();
  console.log(session);
  const user = rows[0];
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
  // const [user, setUser] = useState<any | null>(null); // Replace 'any' with the actual type of your user data
  // const [isLoaded, setIsLoaded] = useState<boolean>(false);
  // const { status, data: session } = useSession();
  // 
  // 
  // const [sessionUser, setSessionUser] = useState<any | null>(null);
  // const [deleted, setDeleted] = useState<boolean>(false);
  // const [posts, setPosts] = useState<any | null>(null);
  // const router = useRouter();
  
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const userData = await getUserByUsername(params.username);
  //       setPosts(userData.posts);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   fetchData();
  // }, [deleted]);

  // async function handleDelete(posturl: string) {
  //   await fetch(`/api/posts/${user?.username}?postid=${posturl}`, {
  //     method: "DELETE",
  //   });
  //   setDeleted(true);
  // }


  // if (!isLoaded) {
  //   // Loading skeleton or spinner while fetching data
  //   return (
  //     <div className="w-full max-h-screen flex justify-center items-center bg-background" style={
  //       {
  //         minHeight: "calc(100vh - 192px)"
  //       }
  //     }>
  //        <Icons.spinner className="h-10 animate-spin" />
  //      </div>
  //   )
  // }




  return (
    <div className="Layout Layout--flowRow-until-md gap-2 lg:gap-6" >
      <UserDetails user={user} followers={followers} followings={following} className="lg:w-[296px] md:w-64 w-full mx-auto" />
      <UserPosts posts={posts} className="row-span-2 md:col-span-2" user={user} sessionUser={sessionUserName} />
    </div>
  );
}