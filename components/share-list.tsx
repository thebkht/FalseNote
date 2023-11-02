import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function ShareList({ className, children, url, text, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenu> & { children: React.ReactNode, className?: string, url: string, text: string }) {
     return (
          <>
               <DropdownMenu {...props}>
                    <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
                    <DropdownMenuContent>
                         <DropdownMenuItem>Copy link</DropdownMenuItem>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem>Share on Twitter</DropdownMenuItem>
                         <DropdownMenuItem>Share on Facebook</DropdownMenuItem>
                         <DropdownMenuItem>Share on LinkedIn</DropdownMenuItem>
                    </DropdownMenuContent>
               </DropdownMenu>

          </>
     )
}