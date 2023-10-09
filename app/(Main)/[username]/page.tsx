import { getSession } from "next-auth/react";
import { getSessionUser } from "@/components/get-session-user";
import { redirect, useRouter } from "next/navigation";
import { sql } from "@vercel/postgres";
import { ro } from "date-fns/locale";
import { User } from "lucide-react";
import UserDetails from "@/components/user/details";

export default async function Page({ params }: {
   params: {
      username: string
   }
 }) {
  const { rows } = await sql`SELECT * FROM users WHERE username = ${params.username}`;


  const session = await getSession();
  const user = rows[0];
  
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
  //       setUser(userData);
  //       if (status === "authenticated") {
  //         const followerId = (await getSessionUser()).userid;
  //         setSessionUser(await getSessionUser());
  //         setIsFollowing(userData.followers.find((follower: any) => follower.userid === followerId));
  //       }
  //       setIsLoaded(true);
  //     } catch (error) {
  //       console.error(error);
  //       setIsLoaded(true);
  //     }
  //   }

  //   fetchData();
  // }, [params.username, isFollowingLoading, deleted]);
  
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
      {/* <div className="row-span-2 md:col-span-2">
        <div className="user-articles py-4 md:px-8 space-y-6">
          {posts?.length > 0 ? (
            posts?.map((article: any) => (
                article.visibility === "public" &&
                  (
                    <ContextMenu key={article.postid}>
                    <div className="space-y-3 md:space-y-6">
                    <ContextMenuTrigger className="">
                    <PostCard
                title={article.title}
                thumbnail={article.coverimage}
                content={article.description}
                author={user?.username || user?.name}
                date={article.creationdate}
                views={formatNumberWithSuffix(article.views)}
                comments={formatNumberWithSuffix(article.comments || 0)}
                id={article.id}
                authorid={user?.userid}
                session={sessionUser}
                likes={formatNumberWithSuffix(article.likes || 0)}
                url={`/${user?.username}/${article.url}`}
                posturl={article.url}
                className="mt-4" />
                      </ContextMenuTrigger>
                    <ContextMenuContent>
                      {session?.user?.name === user?.name || session?.user?.name === user?.username ? (
                        <ContextMenuItem>
                        <Link href={`/editor/${article.url}`}>
                          Edit
                        </Link>
                        </ContextMenuItem>) : (  null )}
                      {session?.user?.name === user?.name || session?.user?.name === user?.username ? (
                        <ContextMenuItem onClick={() => handleDelete(article.postid)}>
                          Delete
                        </ContextMenuItem>) : (  null )}
                      <ContextMenuItem>Save</ContextMenuItem>
                      <ContextMenuItem>Share</ContextMenuItem>
                    </ContextMenuContent>
                    </div>
                  </ContextMenu>)
            ))
          ) : (
            <p className="text-base font-light text-center py-5">This user has no posts</p>
          )}
        </div>
      </div> */}
    </div>
  );
}