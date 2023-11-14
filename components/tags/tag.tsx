import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function TagBadge({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof Badge>) {
     return (
          <Badge className={cn("px-2.5 hover:bg-secondary-foreground hover:text-secondary", className)} variant={"secondary"} {...props}>
               {children}
          </Badge>
     )
}