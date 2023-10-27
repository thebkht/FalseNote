import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function TagBadge({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof Badge>) {
     return (
          <Badge className={cn("bg-badge text-primary px-2.5 hover:text-primary-foreground hover:bg-primary", className)} variant={"secondary"} {...props}>
               {children}
          </Badge>
     )
}