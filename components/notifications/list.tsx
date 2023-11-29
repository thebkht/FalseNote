'use client';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import postgres from "@/lib/postgres";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { dateFormat } from "@/lib/format-date";
import { notificationRead } from "./update";

export default function NotificationList({ notifications, ...props }: { notifications: any } & React.ComponentPropsWithoutRef<typeof Card>) {
     return (
          <Card className="rounded-lg bg-background border-none shadow-none">
                    <CardHeader className="py-4 px-0">
                         <CardTitle className="text-base">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                         <div className="flex flex-col items-start justify-between gap-4">
                              {notifications.length && (notifications?.map((notification: any) => (
                                   <div className="flex gap-4 items-center" key={notification.id}  onClick={
                                        async () => {
                                             await notificationRead(notification.id)
                                        }
                                   
                                   }>
                                   <Badge variant={notification?.read ? 'secondary' : 'default'} className="h-2 w-2 p-0" />
                                   <div className="flex gap-4 w-full items-center justify-between" key={notification.id}>
                                        <div className="space-x-3 flex items-center">
                                             <Link href={`/@${notification?.sender?.username}`}>
                                                  <Avatar className="h-9 w-9 mr-0.5 border">
                                                       <AvatarImage src={notification?.sender?.image} alt={notification?.sender?.username} />
                                                       <AvatarFallback>{notification?.sender?.name?.charAt(0) || notification?.sender?.username?.charAt(0)}</AvatarFallback>
                                                  </Avatar>
                                             </Link>
                                             <Link href={notification.url}>
                                                  <div className="flex flex-col items-start gap-1">
                                                       <p className="text-sm font-normal leading-none">{
                                                            //make bold sender username and if type comment make bold post title from content
                                                            <span className="font-bold">{notification?.sender?.name || notification?.sender?.username}</span>
                                                       } {notification?.type === 'comment' && (
                                                            <>
                                                                 <span>commented on your post: </span>
                                                                 <span className="font-bold">{notification.content}</span>
                                                            </>
                                                       )} {notification?.type === 'like' && (
                                                            <span>liked your post</span>
                                                       )} {notification?.type === 'follow' && (
                                                            <span>is now following you</span>
                                                       )}
                                                       { notification.type === 'reply' && (
                                                            <>
                                                                 <span>replied to your comment: </span>
                                                                 <span className="font-bold">{notification.content}</span>
                                                            </>
                                                       )}
                                                       { notification.type === 'commentLike' && (
                                                            <>
                                                                 <span>liked your comment: </span>
                                                                 <span className="font-bold">{notification.content}</span>
                                                            </>
                                                       )}
                                                       {
                                                            notification.type === 'postLike' && (
                                                                 <>
                                                                      <span>liked your post: </span>
                                                                      <span className="font-bold">{notification.content}</span>
                                                                 </>
                                                            )
                                                       }
                                                       </p>
                                                       <p className="!text-muted-foreground text-sm">
                                                            {dateFormat(notification?.createdAt)}
                                                       </p>
                                                  </div>
                                             </Link>
                                        </div>
                                   </div>
                                   </div>
                              )))}
                         </div>
                    </CardContent>
               </Card>
     );
}