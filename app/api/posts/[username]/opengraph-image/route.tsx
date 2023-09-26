import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from '@vercel/og'


export const runtime = 'edge';

const formatDate = (dateString: string | number | Date) => {
     //format date ex: if published this year Apr 4, otherwise Apr 4, 2021
     const date = new Date(dateString)
     const currentYear = new Date().getFullYear()
     const year = date.getFullYear()
     const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour12: true,
     })
     return formattedDate
}

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
     try {
          const { username } = params
          const postUrl = req.nextUrl.searchParams.get("url");

          const response = await fetch(`${process.env.DOMAIN}/api/posts/${username}?url=${postUrl}`);
          if (!response.ok) {
               throw new Error(`Error fetching user data: ${response.statusText}`);
          }
          const data = await response.json();
          const post = data;

          const fontData = await fetch(
               new URL(`${process.env.DOMAIN}/_next/static/media/Inter-VariableFont_slnt,wght.ttf`, import.meta.url),
          ).then((res) => res.arrayBuffer());

          return new ImageResponse(
               (
                    <div tw="w-full h-full flex flex-col justify-end items-stretch justify-end bg-slate-200" style={{ fontFamily: "Inter" }}>
                         {post.coverimage !== null ? (
                              <img
                                   src={post.coverimage}
                                   alt=""
                                   tw="w-full h-full"
                                   style={{ objectFit: 'cover', objectPosition: 'center' }}
                              />
                         ) : (
                              <div tw="w-full h-full bg-slate-200" >
                                   <div tw="flex justify-center items-center h-full">
                                        <span tw="text-8xl text-slate-400">{post.title}</span>
                                   </div>
                              </div>
                         )
                         }
                         <div tw="bg-white flex flex-col py-6 px-14">
                              <div tw="text-4xl mb-8 font-bold">{post.coverimage && post?.title}</div>
                              <div tw="flex items-center">
                                   <div tw="flex w-10 h-10 mr-3 rounded-full">
                                        <span tw="rounded-full">
                                             <img tw="rounded-full" alt={post.author?.name || post.author?.username} src={post.author?.profilepicture} />
                                        </span>
                                   </div>
                                   <div tw="flex items-center">
                                        <span tw="font-bold text-xl" style={{ fontWeight: "700" }}>{post.author?.username} – {formatDate(post?.creationdate)} </span>
                                   </div>
                              </div>
                         </div>
                    </div>
               ),
               {
                    width: 1200,
                    height: 630,
                    fonts: [
                         {
                              data: fontData,
                              name: 'Inter',
                              style: 'normal',
                         },
                    ],
               },
          );
     } catch (error) {
          console.error(error);
     }
}