import { getUserByUsername } from "@/components/get-user";
import { Icons } from "@/components/icon";
import { ImageResponse } from "next/server";

export const size = {
     width: 1200,
     height: 630,
}

export const contentType = 'image/png'

interface Props {
     params: { username: string }
}

export async function og(
     { params }: Props
) {
     const user = await getUserByUsername(params.username);

     return new ImageResponse(
          <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
    <div tw="bg-gray-50 flex w-full h-full">
      <div tw="absolute flex top-10 left-10">
          <Icons.logo className="h-10 w-10" />
        </div>
        <div tw="absolute bottom-10 left-10 flex flex-col">
          <h1 tw="text-[50px] mb-0">{user?.name}</h1>
          <p tw="text-2xl p-0">{user?.username}</p>
        </div>
    </div>
    </div>
     )
}
