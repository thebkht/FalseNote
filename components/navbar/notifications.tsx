import {
     Popover,
     PopoverContent,
     PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button"
import { Bell } from "lucide-react"


export function Notifications({ notifications, className, ...props }: React.ComponentPropsWithoutRef<typeof Popover> & { className?: string, notifications: any }) {
     return (
          <>
               <Popover>
                    <PopoverTrigger>
                         <Button variant={"ghost"} size={"icon"}>
                              <Bell className="w-[1.25rem] h-[1.25rem]" />
                         </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                         {
                              notifications.map((notification: any) => {
                                   <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
                                             <div className="flex items-center space-x-2">
                                                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                                                       <Bell className="w-4 h-4" />
                                                  </div>
                                                  <div>
                                                       <p className="text-xs text-muted-foreground">{notification.message}</p>
                                                  </div>
                                             </div>
                                             <div>
                                                  <p className="text-xs text-muted-foreground">{notification.date}</p>
                                             </div>
                                        </div>
                              }
                              )

                         }
                    </PopoverContent>
               </Popover>

          </>
     )
}