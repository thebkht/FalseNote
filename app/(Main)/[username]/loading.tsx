import { Icons } from "@/components/icon";

export default function Loading(){
     return (
          <div className="w-full h-screen flex justify-center items-center bg-background">
         <Icons.logo className="w-56 h-28 animate-pulse" />
       </div>
     )
}