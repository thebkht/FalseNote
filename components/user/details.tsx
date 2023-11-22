"use client";

import { CalendarDays, Mail, MapPin, ShareIcon, Users2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icons } from "../icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import UserHoverCard from "../user-hover-card";
import Link from "next/link";
import { formatNumberWithSuffix } from "../format-numbers";
import LoginDialog from "../login-dialog";
import { useSession } from "next-auth/react";
import { useEffect, useState, } from "react";
import { getSessionUser } from "../get-session-user";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { validate } from "@/lib/revalidate";
import ShareList from "./share";

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

export default function UserDetails({ className, children, user, followers, followings, session }: { children?: React.ReactNode, className?: string, user: any, followers: any, followings: any, session: any }) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(followers.find((follower: any) => follower.followerId === session?.id));
  const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
  const router = useRouter();
  const { status } = useSession();

  async function handleFollow(followeeId: string) {
    if (status === "authenticated") {
      setIsFollowingLoading(true);
      try {
        setIsFollowing(!isFollowing);
        const followerId = (await getSessionUser())?.id;
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
      await validate(`/@${user?.username}`)
      router.refresh();
    }
  }

  const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const checkScroll = () => {
    if (window.pageYOffset > 1000) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  window.addEventListener('scroll', checkScroll);
  console.log(window.pageYOffset)

  return () => {
    window.removeEventListener('scroll', checkScroll);
  };
}, []);

  return (
    <>
      <div className={cn("flex flex-col items-stretch justify-between xs:h-fit details", className)}>
        <div className="flex-1">
          <div className="flex lg:flex-col items-start">
            <div className="user__header flex md:block md:items-start lg:space-y-4 space-y-2 pb-4">
              <Avatar className="rounded-full mr-3 lg:w-64 xl:w-[296px] w-16 md:w-56 md:h-56 lg:h-64 xl:h-[296px] border h-16">
                <AvatarImage className="rounded-full" src={user?.image} alt={user?.name} />
                <AvatarFallback className="text-8xl text-foreground">{user?.name ? user?.username?.charAt(0) : user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center md:py-4 w-full justify-between">
                {
                  user?.name ? (
                    <div className="md:space-y-3 w-full">
                      <h1 className="font-bold text-xl lg:text-2xl flex items-center"><span>{user?.name}</span> {user?.verified && (
                        <Icons.verified className="h-5 lg:h-6 w-5 lg:w-6 mx-0.5 inline fill-primary align-middle" />
                      )} {user?.falsemember && (
                        <Image src='https://avatars.githubusercontent.com/u/144859178?v=4' alt="False icon" height={30} width={30} className="h-5 lg:h-6 w-5 lg:w-6 inline rounded border align-middle" />
                      )}</h1>
                      <span className="text-lg md:text-xl font-light text-muted-foreground">{user?.username}</span>
                    </div>
                  ) : (
                    <div className="md:space-y-3 w-full">
                      <h1 className="font-bold text-lg lg:text-2xl flex items-center"><span>{user?.username}</span> {user?.verified && (
                        <Icons.verified className="h-5 lg:h-6 w-5 lg:w-6 mx-0.5 inline fill-primary align-middle" />
                      )} {user?.falsemember && (
                        <Image src='https://avatars.githubusercontent.com/u/144859178?v=4' alt="False icon" height={30} width={30} className="h-5 lg:h-6 w-5 lg:w-6 inline rounded border align-middle" />
                      )}</h1>
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full gap-2">
            {
              status === "authenticated" ? (
                session?.id === user?.id ? (
                  <Button variant={"outline"} className="w-full">
                    <Link href="/settings/profile">
                      Edit Profile
                    </Link>
                  </Button>
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
                <LoginDialog>
                  <Button className="w-full">Follow</Button>
                </LoginDialog>
              )
            }
            <ShareList url={`https://falsenotes.netlify.app/@${user?.username}`} text={`Check ${user.name || user.username}'s profile on @FalseNotesTeam`}>
              <Button variant={"secondary"} className="px-2">
                <ShareIcon className="h-5 w-5 text-muted-foreground" />
              </Button>
            </ShareList>
          </div>
          {user.bio && (<div className="w-full mt-5">{user?.bio}</div>)}

          <div className="py-4 items-center flex gap-2 w-full">
            <Users2 className="h-5 w-5 text-muted-foreground" />
            <Dialog>
              <DialogTrigger><Button variant={"ghost"} size={"sm"} asChild>
                <span>{formatNumberWithSuffix(followers?.length)} <span className="text-muted-foreground ml-2">Followers</span></span>
              </Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Followers</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {followers?.map((follower: any) => (
                    <div className="flex gap-4 w-full items-center justify-between" key={follower.id}>
                      <div className="space-y-3">
                        <UserHoverCard user={follower.follower} >
                          <Link href={`/@${follower.follower?.username}`} className="flex items-center">
                            <Avatar className="h-10 w-10 mr-2 md:mr-3">
                              <AvatarImage src={follower.follower?.image} alt={follower.follower?.username} />
                              <AvatarFallback>{follower.follower?.name?.charAt(0) || follower.follower?.username?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {
                              follower.follower?.name === null ? (
                                <div>
                                  <p className="text-sm font-medium leading-none">{follower.follower?.username} {follower?.follower?.verified && (
                                    <Icons.verified className="h-3 w-3 inline fill-primary align-middle" />
                                  )}</p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-sm font-medium leading-none">{follower.follower?.name} {follower?.follower?.verified && (
                                    <Icons.verified className="h-3 w-3 inline fill-primary align-middle" />
                                  )}</p>
                                  <p className="text-sm text-muted-foreground">{follower.follower?.username}</p>
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
                    followers?.length === 0 && (
                      <p className="text-sm text-muted-foreground">No followers</p>
                    )
                  }
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger><Button variant={"ghost"} size={"sm"} asChild>
                <span>{formatNumberWithSuffix(followings?.length)} <span className="text-muted-foreground ml-2">Followings</span></span>
              </Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Followings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {followings?.map((following: any) => (
                    <div className="flex gap-4 w-full items-center" key={following.id}>
                      <div className="space-y-3">
                        <UserHoverCard user={following.following} >
                          <Link href={`/@${following.following.username}`} className="flex items-center">
                            <Avatar className="h-10 w-10 mr-2 md:mr-3">
                              <AvatarImage src={following.following.image} alt={following.following.username} />
                              <AvatarFallback>{following.following.name?.charAt(0) || following.following.username?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {
                              following.following.name === null ? (
                                <div>
                                  <p className="text-sm font-medium leading-none">{following.following.username} {following?.following.verified && (
                                    <Icons.verified className="h-3 w-3 inline fill-primary align-middle" />
                                  )}</p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-sm font-medium leading-none">{following.following.name} {following?.following.verified && (
                                    <Icons.verified className="h-3 w-3 inline fill-primary align-middle" />
                                  )}</p>
                                  <p className="text-sm text-muted-foreground">{following.following.username}</p>
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
                    followings?.length === 0 && (
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
      </div>
      <div className={`${isScrolled ? 'flex' : 'hidden'} justify-between duration-700 ease-in-out pr-8 items-center py-4 gap-2 fixed bg-background top-[90px] z-10`}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.image} alt={user?.name} />
          <AvatarFallback>{user?.name?.charAt(0) || user?.username?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="font-bold flex items-center"><span>{user?.name || user?.username}</span>
          {
            user?.verified && (
              <Icons.verified className="h-4 w-4 mx-0.5 inline fill-primary align-middle" />
            )}
        </h1>
        {
              status === "authenticated" ? (
                session?.id === user?.id ? (
                  <Button size={'sm'} variant={"outline"} className="px-4 ml-2">
                    <Link href="/settings/profile">
                      Edit Profile
                    </Link>
                  </Button>
                ) : (
                  <Button size={'sm'} className="px-4 ml-2" onClick={() => {
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
                <LoginDialog>
                  <Button size={'sm'} className="px-4 ml-2">Follow</Button>
                </LoginDialog>
              )
            }
      </div>
    </>
  )
}