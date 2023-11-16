import { Icons } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

export default function NotFound() {
  return (
    
    <AlertDialog open>
    <AlertDialogContent className="p-0 border-none">
    <EmptyPlaceholder className="w-full">
      <EmptyPlaceholder.Icon name="warning" />
      <EmptyPlaceholder.Title>Page not found</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        Sorry 😔 — we couldn&apos;t find what you were looking for.
      </EmptyPlaceholder.Description>
      <Link href="/" className={buttonVariants({ variant: "default" })}>
        Go to Home
      </Link>
    </EmptyPlaceholder>
    </AlertDialogContent>
  </AlertDialog>
  )
}
// export default function NotFound(){
//      const h1Style = {
//           display: "inline-block",
//           fontSize: "24px",
//           fontWeight: 500,
//         };
      
//         const h2Style = {
//           fontSize: "14px",
//           fontWeight: 400,
//           lineHeight: "28px",
//         };
//      return (
//           <main className="flex max-h-screen space-y-5 flex-col items-center justify-around p-24">
//       <div id="__next">
//         <div style={
//           {
//                fontFamily:
//                  'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
//                textAlign: "center",
//                display: "flex",
//                flexDirection: "column",
//                alignItems: "center",
//                height: "100vh",
//                justifyContent: "center",
//              }
//         } className="space-y-10">
//           <Icons.notFound className="h-56" />
//           <div className="flex flex-col space-y-4">
//             {/* 404 page title */}
//             <h2 className="text-4xl font-bold">Lost in the Digital Abyss</h2>
//             <Separator />
//             {/* 404 page subtitle */}
//             <p className="text-lg font-light">Oops! It looks like you&apos;ve taken wrong turn</p>
//           </div>
//           <Button variant={"outline"} size={"lg"} className="py-6" asChild>
//             <Link href="/" className="text-lg">
//               Go back home
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </main>
//      )
// }