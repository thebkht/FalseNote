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
            ( <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
            <div tw="flex w-full h-full">
              <div tw="absolute flex top-10 left-16">
                  <Icons.logo tw="w-72 h-10" />
                </div>
                <div tw="absolute bottom-10 left-10 flex flex-col">
                {
           user?.name === null ? (
             <h1 tw="space-y-3">
         <span tw="font-bold text-2xl block mb-2">{user?.username}</span>
       </h1>
           ) : (
             <h1 tw="space-y-3 inline-block">
         <span tw="font-bold text-[40px] block mb-2">{user?.name}</span>
         <span tw="text-2xl font-light text-muted-foreground">{user?.username}</span>
       </h1>)
         }
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
