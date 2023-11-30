import Link from "next/link";
import { Card, CardContent, CardHeader } from "./ui/card";
import UserHoverCard from "./user-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Icons } from "./icon";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { formatNumberWithSuffix } from "./format-numbers";
import React from "react";
import { Plus } from "lucide-react";
import LoginDialog from "./login-dialog";

export default function UserVerticalCard({ user, className, session, ...props }: { user: any, session: any } & React.ComponentPropsWithoutRef<typeof Card>) {
     const [following, setFollowing] = React.useState<boolean>(false)
     const [followersCount, setFollowersCount] = React.useState<number>(user._count.Followers)

     React.useEffect(() => {
          setFollowersCount(user._count.Followers)
          setFollowing(user.Followers?.some((follower: any) => follower.followerId === session?.id))
     }, [user, session])

     const follow = async () => {
          const followeeId = user.id
          const followerId = session?.id
          const res = await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`)
          setFollowing(!following)
          setFollowersCount(followersCount + (following ? -1 : 1))
          if (!res.ok) {
               setFollowing(!following)
               setFollowersCount(followersCount + (following ? -1 : 1))  
          }
     }
     return (
          <Card className={cn("rounded-lg feedArticleCard !bg-background max-h-72 flex-[1_1_20%] self-stretch", className)} {...props}>
               <CardContent className="flex flex-col w-full justify-between p-4 gap-6 h-full">
                    <div className="block">
                         <Link href={`/@${user.username}`}>
                              <Avatar className="h-12 w-12 mr-2">
                                   <AvatarImage src={user.image} alt={user.username} />
                                   <AvatarFallback>{user.name?.charAt(0) || user.username?.charAt(0)}</AvatarFallback>
                              </Avatar>
                         </Link>
                         <div className="w-full flex flex-col">
                              <Link href={`/@${user.username}`}>
                                   <div className="flex items-end pt-3 pb-1 w-full">
                                        <h2 className="line-clamp-1 max-h-5 text-ellipsis font-medium">{user.name || user.username}
                                        </h2>
                                        {user.verified && (
                                             <Icons.verified className="h-4 w-4 mx-0.5 inline fill-primary align-middle" />
                                        )}
                                   </div>
                              </Link>
                              <p className="text-xs text-muted-foreground">{formatNumberWithSuffix(followersCount)} Followers</p>
                              {
                                   user.bio && (
                                        <div className="max-w-full break-words whitespace-pre-wrap mt-3 mb-6">
                                             <p className="text-sm text-muted-foreground line-clamp-3 text-ellipsis">{user.bio}</p>
                                        </div>
                                   )
                              }
                         </div>
                    </div>

                    {
                         session ? (
                              <Button onClick={
                                   session?.id === user.id ? () => {} : follow
                              } variant={following ? "outline" : "default"} className="w-full">
                                   {following ? "Following" : "Follow"}
                              </Button>
                         ) : (
                              <LoginDialog>
                                   <Button className="w-full">
                                        Follow
                                   </Button>
                              </LoginDialog>
                         )
                    }
               </CardContent>
          </Card>
     )
}