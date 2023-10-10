import { getSession } from "next-auth/react";
import { getSessionUser } from "@/components/get-session-user";
import { redirect, useRouter } from "next/navigation";
import { sql } from "@vercel/postgres";
import { ro } from "date-fns/locale";
import { User } from "lucide-react";
import {
  UserDetails,
  UserPosts,
} from "@/components/user";
import getAllUsers from "@/components/get-all-users";

export const generateStaticParams = async () => {
  const users = getAllUsers();
  const paths = (await users).map((user: any) => ({
    params: {
      username: user.username,
    },
  }));
};


export default async function Page({ params }: {
   params: {
      username: string
   }
 }) {
  const { rows } = await sql`SELECT * FROM users WHERE username = ${params.username}`;


  const session = await getSession();
  const user = rows[0];
  if (!user) redirect("/404");
  
  const {rows: posts} = await sql`SELECT * FROM blogposts WHERE authorid = ${user.userid}`;
  const { rows: postComments } = await sql`SELECT * FROM comments WHERE blogpostid IN (SELECT postid FROM blogposts WHERE authorid = ${user.userid})`;
  posts.forEach((post: any) => {
    postComments.forEach((comment: any) => {
      if (comment.postid === post.postid) {
        post.comments = post.comments + 1;
      }
    }
    )
  }
  )
  const { rows: followers } = await sql`SELECT * FROM users WHERE UserID IN (SELECT FollowerID FROM Follows WHERE FolloweeID= ${user.userid})`;
  const { rows: following } = await sql`SELECT * FROM users WHERE UserID IN (SELECT FollowerID FROM Follows WHERE FollowerID= ${user.userid})`;

  const sessionUserName = await getSessionUser();
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