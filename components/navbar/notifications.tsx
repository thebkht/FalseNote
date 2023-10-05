import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"


export function Notifications({ notifications, className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenu> & { className?: string, notifications: any }) {
     return (
          <>
               <DropdownMenu>
                    <DropdownMenuTrigger><Button variant={"ghost"} size={"icon"}>
                    <Bell className="w-[1.25rem] h-[1.25rem]" />
               </Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                         <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         {notifications.map((notification: any) => (
                              <DropdownMenuItem key={notification.id}>
                                   <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                             {
                                                  notification.sender && (
                                                       <Avatar>
                                                            <AvatarImage src={notification.sender.profilepicture} alt={notification.sender.username} />
                                                            <AvatarFallback>{notification.sender.username.charAt(0)}</AvatarFallback>
                                                       </Avatar>
                                                  )
                                             }
                                             <div className="flex flex-col">
                                                  <span className="text-sm text-muted-foreground">{notification.message}</span>
                                             </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{notification.createdat}</span>
                                   </div>
                              </DropdownMenuItem>
                         ))}
                    </DropdownMenuContent>
               </DropdownMenu>


          </>
     )
}