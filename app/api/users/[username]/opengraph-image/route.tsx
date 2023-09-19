import { Icons } from "@/components/icon";
import Image from "next/image";
import { ImageResponse } from "next/server";

export const runtime = 'edge';
interface Props {
     params: { username: string }
}

export async function GET(request: Request,
     { params }: Props
) {
     try{
          const encodedString = params.username.replace(/ /g, "%20");
          const response = await fetch(`${process.env.DOMAIN}/api/users/${encodedString}`);
          if (!response.ok) {
            throw new Error(`Error fetching user data: ${response.statusText}`);
          }
          const data = await response.json();  
           const user = data.user;

          return new ImageResponse(
               ( <div tw="flex flex-col w-full h-screen items-center justify-center bg-white">
               <div tw="bg-gray-50 flex w-full h-full">
                 <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
                   <div tw="absolute top-10 left-10">
                       <Icons.logo tw="h-10 w-72"/>
                   </div>
                   <div tw="absolute bottom-10 left-10">
                   <div tw="flex items-center">
                       <span tw="rounded-full h-48 w-48">
                        <Image tw="rounded-full" src={user?.profilepicture} alt={user?.name} />

                        </span>
                     {
                           user?.name === null ? (
                             <h1 tw="space-y-3">
                         <span tw="font-bold text-[48px] block ">{user?.username}</span>
                       </h1>
                           ) : (
                             <h1 tw="space-y-3">
                         <span tw="font-bold text-[48px] block">{user?.name}</span>
                         <span tw="text-[30px] font-light text-muted-foreground">{user?.username}</span>
                       </h1>)
                         }
                   </div>
                   <div tw="mt-5 grid gap-6 grid-cols-3">
                         <div tw="text-xl bg-secondary">
                           {user?.followersnum} Followers
                         </div>
                         <div tw="text-xl bg-secondary">
                           {user?.followingnum} Followers
                         </div>
                         <div tw="text-xl bg-secondary" >{user?.postsnum} Post</div>
                       </div>
                   </div>
                 </div>
               </div>
             </div>
               ),
               {
                 width: 1200,
                 height: 630,
               },
             );
     }
     catch (e: any) {
          console.log(`${e.message}`);
          return new Response(`Failed to generate the image`, {
            status: 500,
          });
        }
}
