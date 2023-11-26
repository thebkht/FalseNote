import { getSession } from "next-auth/react";
import { getSessionUser } from "@/components/get-session-user";
import { notFound, redirect, useRouter } from "next/navigation";
import postgres from "@/lib/postgres";
import {
  UserDetails,
  UserPosts,
} from "@/components/user";
import UserTab from "@/components/user/tabs";
import { getPost } from "@/lib/prisma/posts";
import { getBookmarks, getHistory } from "@/lib/prisma/session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import UserBookmarks from "@/components/user/bookmark";
import { SiteFooter } from "@/components/footer";


export default async function Page({ params, searchParams }: {
  params: {
    username: string
  },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const decodedUsername = decodeURIComponent(params.username);

  if (!decodedUsername.startsWith('@')) {
    redirect('/404')
  }
  const sessionUserName = await getSessionUser();
  const user = await postgres.user.findFirst({
    include: {
      posts: {
        orderBy: {
          createdAt: "desc"
        },
        include: {
          _count: {
            select: {
              likes: true,
              savedUsers: true,
            },
          },
          savedUsers: true,
          tags: {
            take: 1,
            include: {
              tag: true,
            },
          },
        },
        // if user is a session user, show all posts
        where: {
          OR: [
            {
              published: true,
            },
            {
              authorId: sessionUserName?.id,
            },
          ],
        },
      },
      Followers: {
        include: {
          follower: {
            include: {
              Followers: true,
              Followings: true,
            }
          }
        }
      },
      Followings: {
        include: {
          following: {
            include: {
              Followers: true,
              Followings: true,
            }
          }
        }
      }
    },
    where: {
      username: decodedUsername.substring(1)
    }
  })

  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined


  if (!user) notFound();

  const whereQuery = sessionUserName?.id === user?.id ? {} : { visibility: "public" };

  const { posts } = await getPost({ id: user?.id, search, whereQuery });


  const followers = user.Followers;
  const following = user.Followings;

  const tab = typeof searchParams.tab === 'string' ? searchParams.tab : undefined;
  const { bookmarks } = await getBookmarks({ id: sessionUserName?.id, limit: 10 })
  const { history } = await getHistory({ id: sessionUserName?.id, limit: 10 })
  return (
    <div className="md:container mx-auto px-4 pt-5">
      <div className="gap-5 lg:gap-6 flex flex-col md:flex-row items-start xl:px-4 pt-5" >
        <div className="w-full md:w-1/3 lg:w-1/4">
          <UserDetails user={user} followers={followers} followings={following} session={sessionUserName} />
        </div>
        <div className="lg:pl-8 w-full">
          {sessionUserName?.id === user?.id ? (
            <Tabs className="w-full" defaultValue={tab || "posts"}>
              <TabsList className="bg-background w-full py-4 justify-start h-fit rounded-none gap-2 sticky top-[90px] z-10">
                <TabsTrigger value="posts" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                  Posts
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                  Bookmarks
                </TabsTrigger>
                <TabsTrigger value="reading-history" className="bg-muted data-[state=active]:border data-[state=active]:border-foreground">
                  Reading History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="w-full">
                <UserPosts posts={posts} user={user} sessionUser={sessionUserName} query={whereQuery} search={search} className="w-full" />
              </TabsContent>
              <TabsContent value="bookmarks" className="w-full">
                <UserBookmarks posts={bookmarks} user={user} sessionUser={sessionUserName} tab={`bookmarks`} className="w-full" />
              </TabsContent>
              <TabsContent value="reading-history">
                <UserBookmarks posts={history} user={user} sessionUser={sessionUserName} tab={`history`} className="w-full" />
              </TabsContent>
            </Tabs>) : (
            <UserPosts posts={posts} user={user} sessionUser={sessionUserName} query={whereQuery} search={search} className="w-full" />
          )}
        </div>
      </div>
    </div>
  );
}