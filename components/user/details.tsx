"use client";

import { CalendarDays, Check, Mail, MapPin, Users2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Icons } from "../icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import LoginDialog from "../login-dialog";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getSessionUser } from "../get-session-user";

import { useRef } from "react";

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

export default function UserDetails({ className, children, user, followers, followings} : { children?: React.ReactNode, className?: string, user : any, followers: any, followings: any }) {
     const { data: session, status } = useSession();
     const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
     const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
     const followersRef = useRef(followers);
     
     useEffect(() => {
      async function fetchData(followersRef: React.MutableRefObject<any>, user: any, status: string) {
        if (status === "authenticated") {
          const followerId = (await getSessionUser()).id;
          const userFollowers = await fetch(`/api/users/${user?.username}`);
          const followers = await userFollowers.json().then((res) => res.user.followers);
          followersRef.current = followers;
          setIsFollowing(followers.find((follower: any) => follower.followerId === followerId));
        }
      }

    
      fetchData(followersRef, user, status);
       }, [isFollowing]);

     async function handleFollow(followeeId: string) {
    if (status === "authenticated") {
      setIsFollowingLoading(true);
      try { 
      setIsFollowing(!isFollowing);
      const followerId = (await getSessionUser()).id;
      const result = await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
        method: "GET",
      });
      if (!result.ok) {
        setIsFollowing(!isFollowing);
      }
      setIsFollowingLoading(false);
      } catch (error) {
        console.error(error);
        setIsFollowingLoading(false);
      }
    } else {
      return null;
    }
  }

     return (
          <div className={className}>
          <div className="user__header flex md:block items-center space-y-4">
          <Avatar className="rounded-full mr-3 lg:w-[296px] md:w-64 w-1/6 lg:h-[296px] md:h-64 h-1/6">
              <AvatarImage className="rounded-full" src={user?.image} alt={user?.name} />
              <AvatarFallback className="text-8xl text-foreground">{user?.name === null ? user?.username?.charAt(0) : user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          <div className="flex items-center py-4">
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

          {
            status === "authenticated"? (
              session?.user?.name === user?.name || session?.user?.name === user?.username ? (
                <Button variant={"outline"} className="w-full">Edit Profile</Button>
              ) : (
                <Button className="w-full" onClick={() => {
                  handleFollow(user?.id);
                }} disabled={isFollowingLoading} >
                  {
                    isFollowingLoading ? (
                      <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> {isFollowing ? "Following" : "Follow"}</>
                    ) : (
                      <>{isFollowing ? "Following" : "Follow"}</>
                    )
                  }
                </Button>
              )
            ) : (
              <LoginDialog className="w-full">
                <Button className="w-full">Follow</Button>
              </LoginDialog>
            )
          }

          {user?.bio && (<div className="w-full">{user?.bio}</div>)}

          <div className="py-4 items-center flex gap-2 w-full">
            <Users2 className="h-5 w-5 text-muted-foreground" />
            <Dialog>
  <DialogTrigger><Button variant={"ghost"} size={"sm"} asChild>
              <span>{formatNumberWithSuffix(followersRef.current.length)} <span className="text-muted-foreground ml-2">Followers</span></span>
            </Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Followers</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {followersRef.current.map((follower: any) => (
        <div className="flex gap-4 w-full items-center justify-between" key={follower.id}>
        <div className="space-y-3">
        <UserHoverCard user={follower} >
        <Link href={`/${follower.username}`} className="flex items-center">
          <Avatar className="h-10 w-10 mr-2 md:mr-3">
            <AvatarImage src={follower.image} alt={follower.username} />
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
        </UserHoverCard>
        </div>
        
      </div>
      )) 
            }
            {
              followersRef.current.length === 0 && (
                <p className="text-sm text-muted-foreground">No followers</p>
              )
            }
    </div>
  </DialogContent>
</Dialog>
            <Dialog>
  <DialogTrigger><Button variant={"ghost"} size={"sm"} asChild>
              <span>{formatNumberWithSuffix(followings.length)} <span className="text-muted-foreground ml-2">Followings</span></span>
            </Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Followings</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {followings.map((following: any) => (
        <div className="flex gap-4 w-full items-center" key={following.userid}>
        <div className="space-y-3">
        <UserHoverCard user={following} >
        <Link href={`/${following.username}`} className="flex items-center">
          <Avatar className="h-10 w-10 mr-2 md:mr-3">
            <AvatarImage src={following.image} alt={following.username} />
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
        </UserHoverCard>
        </div>
        
      </div>
      ))
            }

      {
        followings.length === 0 && (
          <p className="text-sm text-muted-foreground">No followings</p>
        )
      }
    </div>
  </DialogContent>
</Dialog>

          </div>

          <ul className="details list-none">
            {user?.location && <li>
              <Button variant={"link"} size={"sm"} asChild className="p-0 !text-sm hover:!no-underline text-foreground">
                <span>
                  <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                  {user?.location}
                </span>
              </Button>
            </li>}
            {user?.email && <li>
              <Button variant={"link"} size={"sm"} asChild className="p-0 text-foreground">
                <Link href={`mailto:${user?.email}`} target="_blank" className="flex items-center font-light !text-sm">
                  <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                  {user?.email}
                </Link>
              </Button>
            </li>}
            <li>
              <Button variant={"link"} size={"sm"} asChild className="p-0 text-foreground" >
                <Link href={user?.githubprofile} target="_blank" className="flex items-center font-light !text-sm">
                  <Icons.gitHub className="mr-2 h-5 w-5 text-muted-foreground" />
                  {user?.githubprofile?.replace("https://github.com/", "")}
                </Link>
              </Button>
            </li>
            <li>
              <Button variant={"link"} size={"sm"} asChild className="p-0 !text-sm hover:!no-underline text-foreground" >
                <span>
                  <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
                  Joined {getRegistrationDateDisplay(user?.createdAt)}
                </span>
              </Button>
            </li>
          </ul>
        </div>
     )
}