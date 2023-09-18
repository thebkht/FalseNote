"use client"
import { getUserByUsername } from "@/components/get-user";
import { Icons } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BadgeCheck, Check, Mail, MapPin, Rocket } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function getRegistrationDateDisplay(registrationDate : string) {
  // Convert the registration date to a JavaScript Date object
  const regDate = new Date(registrationDate);

  const regMonth = regDate.toLocaleString('default', { month: 'long' });
  const regYear = regDate.getFullYear();
  return `${regMonth} ${regYear}`;
}

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
        <div className="user space-y-4">
        <Button variant={"secondary"} size={"lg"} className="mb-5 px-0 h-72 w-72 rounded-full">
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
          <div className="flex items-center">
            {
              user?.name === null ? (
                <h1 className="space-y-3">
            <span className="font-bold text-2xl block mb-2">{user?.username} {user?.verified && (
              <Badge className="h-6 w-6 !px-1">
                <Check className="h-4 w-4" />
              </Badge>
            )}</span>
          </h1>
              ) : (
                <h1 className="space-y-3">
            <span className="font-bold text-2xl block mb-2">{user?.name} {user?.verified && (
              <Badge className="h-6 w-6 !px-1">
                <Check className="h-4 w-4" />
              </Badge>
            )}</span>
            <span className="text-xl font-light text-muted-foreground">{user?.username}</span>
          </h1>)
            }
          </div>

          {session && (
            session?.user?.name === user?.name || session?.user?.name === user?.username ? (
              <Button variant={"outline"} size={"lg"} className="py-3" asChild>
                <Link href="edit_profile.php" className="btn btn-outline-success w-100 mb-5">
                Edit Profile
              </Link>
              </Button>
            ) : (
              null
            ) 
          )}

          <div className="userInfo-buttons py-2">
            <Button variant={"ghost"} className="btn me-3" data-bs-toggle="modal" data-bs-target="#followersModal" data-userid={user?.user_id}>
              <b>{user?.followerCount}</b> Followers
            </Button>
            <Button variant={"ghost"} ><b>{user?.postCount}</b> Articles</Button>
          </div>

          <ul className="details list-none space-y-3">
            {user?.location && <li className="flex items-center">
              <MapPin className="h-5 w-5 mr-1" />
              {user?.location}
            </li>}
            {user?.email && <li className="flex items-center">
              <Mail className="h-5 w-5 mr-1" />
              {user?.email}
            </li>}
            <li className="flex items-center">
              <Icons.gitHub className="h-5 w-5 mr-1" />
              {user?.githubprofileurl.replace("https://github.com/", "")}
            </li>
            <li className="flex items-center">
              <Rocket className="h-5 w-5 mr-1" />
              Joined on {getRegistrationDateDisplay(user?.registrationdate)}
            </li>
          </ul>
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
      <div className="user space-y-4">
        <Skeleton className="mb-5 h-72 w-72 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-72 mb-2" />
          <Skeleton className="h-6 w-56" />
        </div>
        <div className="flex gap-2 py-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>

          <ul className="space-y-3">
            <Skeleton className="h-5 w-72" />
            <Skeleton className="h-5 w-72" />
            <Skeleton className="h-5 w-72" />
            <Skeleton className="h-5 w-72" />
          </ul>
      </div> )
  );
}
