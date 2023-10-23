import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Link from "next/link";
import { CalendarDays, Check, Users2 } from "lucide-react";
import { formatNumberWithSuffix } from "./format-numbers";
import { Button } from "./ui/button";

function formatDate(dateString: string | number | Date) {
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  const year = date.getFullYear();

  let formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  if (year !== currentYear) {
    formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  return formattedDate;
}

export default function UserHoverCard({ user, children, className, ...props }: React.ComponentPropsWithoutRef<typeof HoverCard> & { children: React.ReactNode, className?: string, user: any }) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        {children}
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col space-y-1">
          <Avatar className="h-14 w-14 mb-1">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback>{user?.name ? user?.name.charAt(0) : user?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          {
            user?.name === '' ? (
              <h4 className="text-sm font-semibold">{user?.username} {user?.verified && (<Badge className="h-3 w-3 !px-0"> <Check className="h-2 w-2 mx-auto" /></Badge>)}</h4>
            ) : (
              <div>
                <h4 className="text-sm font-semibold">{user?.name} {user?.verified && (<Badge className="h-3 w-3 !px-0"> <Check className="h-2 w-2 mx-auto" /></Badge>)}</h4>
              <h6 className="text-sm text-muted-foreground !mt-0">{user?.username}</h6>
              </div>
            )
          }
            <p className="text-sm">
              {user?.bio}
            </p>
            {/* <div className="flex items-center flex gap-1 w-full">
            <Users2 className="mr-2 h-5 w-5 text-muted-foreground" />
            <Button variant={"link"} size={"sm"} className="pl-0 py-0" asChild>
              <span><span className="font-bold text-card-foreground">{formatNumberWithSuffix(user.Followers?.length)}</span> <span className="text-muted-foreground ml-2">Followers</span></span>
            </Button>
            <Button variant={"link"} size={"sm"} className="pl-0 py-0" asChild>
              <span><span className="font-bold text-card-foreground">{formatNumberWithSuffix(user.Following?.length)}</span> <span className="text-muted-foreground ml-2">Followings</span></span>
            </Button>
          </div> */}
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-5 w-5 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {formatDate(user?.createdAt)}
              </span>
            </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}