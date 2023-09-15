"use client"
import { getUserByUsername } from "@/components/get-user";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { username: string } }) {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with the actual type of your user data
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserByUsername(params.username);
        setUser(userData);
        setIsLoaded(true);
      } catch (error) {
        // Handle errors
        console.error('Error:', error);
      }
    }

    fetchData();
  }, [params.username]);

  const { data: session } = useSession(); // You might need to adjust this based on how you use the session

  return (
    isLoaded ? (
      <div className="row justify-content-between mb-5">
      <div className="col-lg-3">
        <div className="user">
        <Button variant={"secondary"} size={"lg"} className="mb-3 px-0 h-48 w-48 rounded-full">
          <Avatar className="rounded-full">
            <AvatarImage className="rounded-full" src={user?.profilepicture} alt={user?.name} />
            <AvatarFallback className="text-8xl text-foreground">{user?.name === null ? user?.username?.charAt(0) : user?.name?.charAt(0) }</AvatarFallback>
          </Avatar>
        </Button>
          {/* <div className="profile-photo mb-3">
            <Image
              src={user?.profilepicture}
              alt={`${user?.name}'s profile photo`}
              className="h-100 w-100 rounded-full"
              width={200}
              height={200}
            />
          </div> */}
          <h5 className="font-bold">
            {user?.name}
          </h5>
          <h6 className="mb-3" style={{ color: "#949494" }}>@{user?.username}</h6>
          <p className="d-flex align-items-center"><i className="fa-regular fa-envelope me-1"></i>{user?.email}</p>
          <p className="d-flex align-items-center"><i className="far fa-rocket-launch me-1"></i>{user?.joinedText}</p>
          <div className="userInfo-buttons mb-3">
            <Button className="btn me-3" data-bs-toggle="modal" data-bs-target="#followersModal" data-userid={user?.user_id}>
              <b>{user?.followerCount}</b> Followers
            </Button>
            <Button><b>{user?.postCount}</b> Articles</Button>
          </div>
          {session && (
            session?.user?.name === user?.name || session?.user?.name === user?.username ? (
              <Button variant={"outline"} size={"lg"} className="mb-3" asChild>
                <Link href="edit_profile.php" className="btn btn-outline-success w-100 mb-5">
                Edit Profile
              </Link>
              </Button>
            ) : (
              null
            ) 
          )}
        </div>
        {/* <div className="user-scroll">
          <div className="user-scroll_header">
            <div className="profile-photo mb-3 me-2">
              <Image
                src={user?.profilepicture}
                alt={`${user?.name}'s profile photo`}
                className="h-100 rounded-circle"
                width={100}
                height={100}
              />
            </div>
            <div className="user-scroll_user">
              <span className="user-scroll_name d-block">
                {user?.name}
              </span>
              <span className="mb-3 user-scroll_username">@{user?.username}</span>
            </div>
          </div>
          {session ? (
            session?.user?.name !== user?.name || session?.user?.name !== user?.username ? (
              // Check if the user is already following the profile user
              <form action={`user.php?user_id=${user?.followedId}`} method="POST">
                <input type="hidden" name="user_id" value={user?.followedId} />
                {user?.isFollowing ? (
                  <button type="submit" className="btn btn-outline-success">
                    Following
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success">
                    Follow
                  </button>
                )}
              </form>
            ) : (
              <a href="edit_profile.php" className="btn btn-outline-success">
                Edit Profile
              </a>
            )
          ) : null}
        </div>
      </div>
      <div className="col-lg-8">
        <h2>Articles</h2>
        <div className="user-articles">
          <div className="mb-5 mt-4 w-100 m-auto col-6 search-dropdown">
            <div className="search-input rounded-pill w-100 d-flex align-items-center">
              <i className="fa-regular fa-magnifying-glass"></i>
              <input type="text" className="form-control w-100 rounded-pill" id="searchQuery" name="searchQuery" placeholder="Search" autoComplete="off" />
            </div>
            <div className="dropdown-menu mt-3 w-100" id="searchResults" aria-labelledby="searchQuery"></div>
          </div>
           {user?.articles && user.articles.length > 0 ? (
            user.articles.map((article: any) => (
              <div className="card mb-3 w-100 me-3" key={article.id}>
                <div className="card-body">
                  <a href={`view_post.php?post_id=${article.id}`}><h5 className="card-title">{article.title}</h5></a>
                  <p className="card-text">{article.content.slice(0, 500)}...</p>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  {session?.user_id === article.user_id && (
                    <div className="action-btn">
                      <a href={`edit_post.php?post_id=${article.id}`} className="btn btn-success">Edit</a>
                      <a href={`delete_post.php?post_id=${article.id}`} className="btn btn-danger">Delete</a>
                    </div>
                  )}
                  <div className="stats d-flex align-items-center">
                    <p className="card-text d-inline mb-0 me-3">{new Date(article.created_at).toLocaleString()}</p>
                    <p className="card-text d-inline mb-0 text-muted me-3"><i className="far fa-eye me-1"></i> {article.views}</p>
                    <p className="card-text d-inline mb-0 text-muted"><i className="far fa-comments me-1"></i> {article.comments}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>This user has no posts</p>
          )}
        </div>
      </div> */}
    </div>
    </div> ) : (
      <div className="user">
        <Skeleton className="mb-3 h-48 w-48 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div> )
  );
}
