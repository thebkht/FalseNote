"use client"
import { getUserByUsername } from "@/components/get-user";
import { Icons } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Check, Mail, MapPin, Rocket } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Metadata, ResolvingMetadata } from 'next'
import NotFound from "./not-found";
import PostCard from "@/components/blog/post-card";

type Props = {
  params: { username: string }
}

function getRegistrationDateDisplay(registrationDate: string) {
  // Convert the registration date to a JavaScript Date object
  const regDate = new Date(registrationDate);

  const regMonth = regDate.toLocaleString('default', { month: 'long' });
  const regYear = regDate.getFullYear();
  return `${regMonth} ${regYear}`;
}

export default function Page({ params }: Props) {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with the actual type of your user data
  const [isLoaded, setIsLoaded] = useState<boolean>(false);


  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserByUsername(params.username);
        setUser(userData);
        setIsLoaded(true);
      } catch (error) {
        console.error(error);
        setIsLoaded(true);
      }
    }

    fetchData();
  }, [params.username]);

  const { data: session } = useSession(); // You might need to adjust this based on how you use the session


  if (!isLoaded) {
    // Loading skeleton or spinner while fetching data
    return (
      <div className="row grid gap-6"
      style={
        {
          gridTemplateColumns: "auto 0 minmax(0, calc(100% - 18rem - 1.5rem))"
        }
      }>
        <div className="col-span-1 w-72 space-y-4">
        <Skeleton className="mb-5 h-72 w-72 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-72 mb-2" />
          <Skeleton className="h-6 w-56" />
        </div>
        <div className="flex gap-2 py-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>

        <ul className="space-y-3">
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-5 w-72" />
        </ul>
      </div>
      <div className="col-span-2 items-center text-center">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm space-y-4">
      <div className="flex flex-col space-y-4 p-6">
        <Skeleton className="h-72 w-full" />

        <h1><Skeleton className="h-5 w-full pb-6" /></h1>
        <div className="space-y-3 pt-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      </div>
      <div className="flex items-center p-6 pt-0">
                  <div className="stats flex items-center gap-3">
                    <p className="card-text inline mb-0"><Skeleton className="h-5 w-48" /></p>
                    <p className="card-text inline mb-0 text-muted"><Skeleton className="h-5 w-10" /></p>
                    <p className="card-text inline mb-0 text-muted"><Skeleton className="h-5 w-10" /></p>
                    <p className="card-text inline mb-0 text-muted"><Skeleton className="h-5 w-10" /></p>
                  </div>
      </div>
    </div>
      </div>
      </div>
    );
  }

  if (params.username !== user?.username) {
    return <NotFound />;
  }

  if (!user) {
    // User not found
    return <NotFound />;
  }


  return (
    <div className="row grid gap-6"
    style={
      {
        gridTemplateColumns: "auto 0 minmax(0, calc(100% - 18rem - 1.5rem))"
      }
    }>
      <div className="col-span-1 w-72">
        <div className="user space-y-4">
          <Button variant={"secondary"} size={"lg"} className="mb-5 px-0 h-72 w-72 rounded-full">
            <Avatar className="rounded-full">
              <AvatarImage className="rounded-full" src={user?.profilepicture} alt={user?.name} />
              <AvatarFallback className="text-8xl text-foreground">{user?.name === null ? user?.username?.charAt(0) : user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
          <div className="flex items-center">
            {
              user?.name === null ? (
                <h1 className="space-y-3">
                  <span className="font-bold text-2xl block">{user?.username} {user?.verified && (
                    <Badge className="h-6 w-6 !px-1">
                      <Check className="h-4 w-4" />
                    </Badge>
                  )}</span>
                </h1>
              ) : (
                <h1 className="space-y-3">
                  <span className="font-bold text-2xl block">{user?.name} {user?.verified && (
                    <Badge className="h-6 w-6 !px-1">
                      <Check className="h-4 w-4" />
                    </Badge>
                  )}</span>
                  <span className="text-xl font-light text-muted-foreground">{user?.username}</span>
                </h1>)
            }
          </div>

          {session?.user?.name === user?.name || session?.user?.name === user?.username ? (
              <Button className="w-full">Edit Profile</Button>
            ) : (
              <Button className="w-full" >Follow</Button>
            )}

            { user?.bio && ( <div className="w-full">{ user?.bio }</div> ) }

          <div className="py-2 flex gap-2">
            <Button variant={"secondary"} size={"sm"} className="!text-sm">
              {user?.followersnum} Followers
            </Button>
            <Button variant={"secondary"} size={"sm"} className="!text-sm">
              {user?.followingnum} Followers
            </Button>
            <Button variant={"secondary"} size={"sm"} className="!text-sm" >{user?.postsnum} Post</Button>
          </div>

          <ul className="details list-none">
            {user?.location && <li>
              <Button variant={"link"} size={"sm"} asChild className="p-0 !text-sm hover:!no-underline">
                <span>
                <MapPin className="mr-2 h-5 w-5" />
                {user?.location}
                </span>
              </Button>
            </li>}
            {user?.email && <li>
              <Button variant={"link"} size={"sm"} asChild className="p-0">
              <Link href={`mailto:${user?.email}`} target="_blank" className="flex items-center font-light !text-sm">
                <Mail className="mr-2 h-5 w-5" />
                {user?.email}
              </Link>
              </Button>
            </li>}
            <li>
              <Button variant={"link"} size={"sm"} asChild className="p-0" >
              <Link href={user?.githubprofileurl} target="_blank" className="flex items-center font-light !text-sm">
                <Icons.gitHub className="mr-2 h-5 w-5" />
                {user?.githubprofileurl.replace("https://github.com/", "")}
              </Link>
              </Button>
            </li>
            <li>
              <Button variant={"link"} size={"sm"} asChild className="p-0 !text-sm hover:!no-underline" >
                <span>
                <Rocket className="mr-2 h-5 w-5" />
              Joined on {getRegistrationDateDisplay(user?.registrationdate)}
                </span>
              </Button>
            </li>
          </ul>
        </div>


      </div>
      <div className="col-span-2">
        <h2 className="text-2xl font-bold text-center">Posts</h2>
        <div className="user-articles">
          {user?.posts && user.posts.length > 0 ? (
            user.posts.map((article: any) => (
              <PostCard
                key={article.id}
                title={article.title}
                thumbnail={article.coverimage}
                content={article.content}
                author={user?.username || user?.name}
                date={article.creationdate}
                views={article.views}
                comments={article.comments}
                id={article.id}
                authorid={user?.id}
                session={session}
                likes={article.likes} />
            ))
          ) : (
            <p className="text-base font-light text-center py-5">This user has no posts</p>
          )}
        </div>
      </div>
    </div>
  );
}