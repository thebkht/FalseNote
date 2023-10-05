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
import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"

function dateFormat(dateString: string | number | Date) {
     const date = new Date(dateString)
     const currentDate = new Date()
     const currentYear = currentDate.getFullYear()
     const currentDay = currentDate.getDate()
     const currentHour = currentDate.getHours()
     const currentMinute = currentDate.getMinutes()
     const currentSecond = currentDate.getSeconds()
   
     const year = date.getFullYear()
     const month = date.getMonth()
     const day = date.getDate()
     const hour = date.getHours()
     const minute = date.getMinutes()
     const second = date.getSeconds()
   
     const dayDifference = currentDay - day
     const hourDifference = currentHour - hour
     const minuteDifference = currentMinute - minute
     const secondDifference = currentSecond - second
   
     //when posted ex: 1 hour ago 1 day ago
     if (dayDifference === 0) {
           if (hourDifference === 0) {
                 if (minuteDifference === 0) {
                     return `${secondDifference}s`
                 }
                 return `${minuteDifference}m`
           }
           return `${hourDifference}h`
       } 
       //if more than 30 days ago, show date ex: Apr 4, 2021
       if (dayDifference > 30) {
           if (year !== currentYear) {
               return `${date.toLocaleDateString('en-US', {
                   year: 'numeric',
                   month: 'short',
                   day: 'numeric',
               })}`
           }
           return `${date.toLocaleDateString('en-US', {
               month: 'short',
               day: 'numeric',
           })}`
       } else {
         return `${dayDifference}d`
       }
   }

export function Notifications({ notifications, className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenu> & { className?: string, notifications: any }) {
     return (
          <>
               <DropdownMenu>
                    <DropdownMenuTrigger><Button variant={"ghost"} size={"icon"}>
                    <Bell className="w-[1.25rem] h-[1.25rem]" />
                    {
                         notifications.find((notification: any) => notification.readat === null) && (
                              <Badge className="ml-2 md:ml-3 p-0 h-3 w-3 absolute mb-3 border-[3px] border-solid border-secondary-foreground" />
                         )
                    }
               </Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" forceMount className="!max-h-[500px]">
                         <DropdownMenuLabel className="text-base">Notifications</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         <ScrollArea className="h-full">
                         {notifications && notifications.map((notification: any) => (
                              <DropdownMenuItem key={notification.notificationid}>
                                   <div className="flex w-full gap-3">
                                   {
                                                  notification.sender && (
                                                       <Avatar>
                                                            <AvatarImage src={notification.sender.profilepicture} alt={notification.sender.username} />
                                                            <AvatarFallback>{notification.sender.username.charAt(0)}</AvatarFallback>
                                                       </Avatar>
                                                  )
                                             }
                                        <div className="flex flex-col gap-y-2 pr-2 w-80">
                                                  <span className="text-sm font-medium">{notification.message}</span>
                                                  <span className="text-xs text-muted-foreground">{dateFormat(notification.createdat)}</span>
                                             </div>
                                   </div>
                              </DropdownMenuItem>
                         ))}
                         {notifications && notifications.length === 0 && (
                              <DropdownMenuItem>
                                   <div className="flex items-center justify-between w-full gap-3">
                                        <div className="flex flex-col gap-y-2">
                                                  
                                                  <span className="text-sm">No notifications</span>
                                                  
                                                  </div>
                                                  </div>
                                                  </DropdownMenuItem>
                                                  )}
                                                  </ScrollArea>
                    </DropdownMenuContent>
               </DropdownMenu>


          </>
     )
}