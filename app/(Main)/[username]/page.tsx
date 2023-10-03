"use client"
import { getUserByUsername } from "@/components/get-user";
import { Icons } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Check, Mail, MapPin, Rocket } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import NotFound from "./not-found";
import PostCard from "@/components/blog/post-card";
import { getSessionUser } from "@/components/get-session-user";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Props = {
  params: { username: string }
}

function getRegistrationDateDisplay(registrationDate: string) {
  ///format date ex: if published this year Apr 4, otherwise Apr 4, 2021
  const date = new Date(registrationDate)
  const currentYear = new Date().getFullYear()
  const year = date.getFullYear()
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour12: true,
  })
  if (year !== currentYear) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: true,
    })
  }
  return formattedDate
}

function formatNumberWithSuffix(num: number): string {
  //if number as 
  //format number with suffix ex: 1.5K, 2.3M, 4.5B
  //if number is 0 or NaN return 0
  if (isNaN(num) || num === 0) {
    return "0";
  } else{
    const suffixes = ["", "K", "M", "B", "T"];
    const magnitude = Math.floor(Math.log10(num) / 3);
    const divisor = Math.pow(10, magnitude * 3);
    const suffix = suffixes[magnitude];
    const roundedNum = Math.round(num / divisor * 10) / 10;
    return `${roundedNum}${suffix}`;
  }
}

export default function Page({ params }: Props) {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with the actual type of your user data
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { status, data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
  const [sessionUser, setSessionUser] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserByUsername(params.username);
        setUser(userData);
        if (status === "authenticated") {
          const followerId = (await getSessionUser()).userid;
          setSessionUser(await getSessionUser());
          setIsFollowing(userData.followers.find((follower: any) => follower.userid === followerId));
        }
        setIsLoaded(true);
      } catch (error) {
        console.error(error);
        setIsLoaded(true);
      }
    }

    fetchData();
  }, [params.username, isFollowingLoading]);

  async function handleFollow(followeeId: string) {
    if (status === "authenticated") {
      setIsFollowingLoading(true);
      try { 
      const followerId = (await getSessionUser()).userid;
      await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
        method: "GET",
      });
      setIsFollowingLoading(false);
      } catch (error) {
        console.error(error);
        setIsFollowingLoading(false);
      }
    } else {
      return null;
    }
  }

  if (!isLoaded) {
    // Loading skeleton or spinner while fetching data
    return (
      <div className="w-full max-h-screen flex justify-center items-center bg-background" style={
        {
          minHeight: "calc(100vh - 192px)"
        }
      }>
         <Icons.spinner className="h-10 animate-spin" />
       </div>
    )
  }

  if (params.username !== user?.username) {
    return <NotFound />;
  }

  if (!user) {
    // User not found
    return <NotFound />;
  }


  return (
    <div className="Layout Layout--flowRow-until-md gap-2 lg:gap-6" >
      <div className="lg:w-[296px] md:w-64 w-full mx-auto">
        <div className="user space-y-4">
          <div className="user__header flex md:block items-center">
          <Avatar className="rounded-full mr-3 lg:w-[296px] md:w-64 w-1/6 lg:h-[296px] md:h-64 h-1/6">
              <AvatarImage className="rounded-full" src={user?.profilepicture} alt={user?.name} />
              <AvatarFallback className="text-8xl text-foreground">{user?.name === null ? user?.username?.charAt(0) : user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          <div className="flex items-center">
            {
              user?.name === null ? (
                <h1 className="space-y-3 w-full">
                  <span className="font-bold text-xl md:text-2xl block">{user?.username} {user?.verified && (
                    <Badge className="h-5 md:h-6 w-5 md:w-6 !px-1">
                      <Check className="w-3 md:h-4 h-3 md:w-4" />
                    </Badge>
                  )} { user?.falsemember && (
                    <Icons.logoIcon className="h-4 md:h-5 w-4 md:w-5 inline" />
                  ) }</span>
                </h1>
              ) : (
                <h1 className="md:space-y-3 w-full">
                  <span className="font-bold text-xl md:text-2xl block">{user?.name} {user?.verified && (
                    <Badge className="h-5 md:h-6 w-5 md:w-6 !px-1">
                      <Check className="w-3 md:h-4 h-3 md:w-4" />
                    </Badge>
                  )} { user?.falsemember && (
                    <Icons.logoIcon className="h-4 md:h-5 w-4 md:w-5 inline" />
                  ) }</span>
                  <span className="text-lg md:text-xl font-light text-muted-foreground">{user?.username}</span>
                </h1>)
            }
          </div>
          </div>

          {session?.user?.name === user?.name || session?.user?.name === user?.username ? (
            <Button variant={"outline"} className="w-full">Edit Profile</Button>
          ) : (
            <Button variant={"secondary"} className="w-full" onClick={() => {
              handleFollow(user?.userid);
            }} disabled={isFollowingLoading} >
              {
                isFollowingLoading ? (
                  <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> {isFollowing ? "Following" : "Follow"}</>
                ) : (
                  <>{isFollowing ? "Following" : "Follow"}</>
                )
              }
            </Button>
          )}

          {user?.bio && (<div className="w-full">{user?.bio}</div>)}

          <div className="py-2 flex gap-2 justify-around md:justify-between w-full">
            
            <Dialog>
  <DialogTrigger><Button variant={"ghost"} size={"sm"} asChild>
              <span>{formatNumberWithSuffix(user?.followers.length)} Followers</span>
            </Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Followers</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {user?.followers.map((follower: any) => (
        <div className="flex gap-4 w-full items-center justify-between" key={follower.userid}>
        <div className="space-y-3">
        <Link href={`/${follower.username}`} className="flex items-center">
          <Avatar className="h-10 w-10 mr-2 md:mr-3">
            <AvatarImage src={follower.profilepicture} alt={follower.username} />
            <AvatarFallback>{follower.name?.charAt(0) || follower.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          {
            follower.name === null ? (
              <div>
                <p className="text-sm font-medium leading-none">{follower.username} {follower?.verified && (
            <Badge className="h-3 w-3 !px-0">
              <Check className="h-2 w-2 mx-auto" />
            </Badge>
          )}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium leading-none">{follower.name} {follower?.verified && (
            <Badge className="h-3 w-3 !px-0">
              <Check className="h-2 w-2 mx-auto" />
            </Badge>
          )}</p>
                <p className="text-sm text-muted-foreground">{follower.username}</p>
              </div>
            )
          }
        </Link>
        </div>
        
      </div>
      )) 
            }
            {
              user?.followers.length === 0 && (
                <p className="text-sm text-muted-foreground">No followers</p>
              )
            }
    </div>
  </DialogContent>
</Dialog>
            <Dialog>
  <DialogTrigger><Button variant={"ghost"} size={"sm"} asChild>
              <span>{formatNumberWithSuffix(user?.following.length)} Followings</span>
            </Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Followings</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {user?.following.map((following: any) => (
        <div className="flex gap-4 w-full items-center justify-between" key={following.userid}>
        <div className="space-y-3">
        <Link href={`/${following.username}`} className="flex items-center">
          <Avatar className="h-10 w-10 mr-2 md:mr-3">
            <AvatarImage src={following.profilepicture} alt={following.username} />
            <AvatarFallback>{following.name?.charAt(0) || following.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          {
            following.name === null ? (
              <div>
                <p className="text-sm font-medium leading-none">{following.username} {following?.verified && (
            <Badge className="h-3 w-3 !px-0">
              <Check className="h-2 w-2 mx-auto" />
            </Badge>
          )}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium leading-none">{following.name} {following?.verified && (
            <Badge className="h-3 w-3 !px-0">
              <Check className="h-2 w-2 mx-auto" />
            </Badge>
          )}</p>
                <p className="text-sm text-muted-foreground">{following.username}</p>
              </div>
            )
          }
        </Link>
        </div>
        
      </div>
      ))
            }

      {
        user?.following.length === 0 && (
          <p className="text-sm text-muted-foreground">No followings</p>
        )
      }
    </div>
  </DialogContent>
</Dialog>

            
            <Button variant={"ghost"} size={"sm"} disabled >{formatNumberWithSuffix(user?.posts.length)} Post</Button>
          </div>

          <ul className="details list-none">
            {user?.location && <li>
              <Button variant={"link"} size={"sm"} asChild className="p-0 !text-sm hover:!no-underline text-foreground">
                <span>
                  <MapPin className="mr-2 h-5 w-5" />
                  {user?.location}
                </span>
              </Button>
            </li>}
            {user?.email && <li>
              <Button variant={"link"} size={"sm"} asChild className="p-0 text-foreground">
                <Link href={`mailto:${user?.email}`} target="_blank" className="flex items-center font-light !text-sm">
                  <Mail className="mr-2 h-5 w-5" />
                  {user?.email}
                </Link>
              </Button>
            </li>}
            <li>
              <Button variant={"link"} size={"sm"} asChild className="p-0 text-foreground" >
                <Link href={user?.githubprofileurl} target="_blank" className="flex items-center font-light !text-sm">
                  <Icons.gitHub className="mr-2 h-5 w-5" />
                  {user?.githubprofileurl.replace("https://github.com/", "")}
                </Link>
              </Button>
            </li>
            <li>
              <Button variant={"link"} size={"sm"} asChild className="p-0 !text-sm hover:!no-underline text-foreground" >
                <span>
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Joined {getRegistrationDateDisplay(user?.registrationdate)}
                </span>
              </Button>
            </li>
          </ul>
        </div>


      </div>
      <div className="row-span-2 md:col-span-2">
        <div className="user-articles py-4 md:px-8 space-y-6">
          {user?.posts && user.posts.length > 0 ? (
            user.posts.map((article: any) => (
                article.visibility === "public" &&
                  (<PostCard
                key={article.id}
                title={article.title}
                thumbnail={article.coverimage}
                content={article.description}
                author={user?.username || user?.name}
                date={article.creationdate}
                views={formatNumberWithSuffix(article.views)}
                comments={formatNumberWithSuffix(article.commentsnum || 0)}
                id={article.id}
                authorid={user?.userid}
                session={sessionUser}
                likes={formatNumberWithSuffix(article.likes || 0)}
                url={`/${user?.username}/${article.url}`}
                posturl={article.url}
                className="mt-4" />)
            ))
          ) : (
            <p className="text-base font-light text-center py-5">This user has no posts</p>
          )}
        </div>
      </div>
    </div>
  );
}