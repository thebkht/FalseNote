/* eslint-disable @next/next/no-img-element */
import { Icons } from "@/components/icon";
import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

const regularFont = fetch(
  new URL('/public/assets/PolySans Neutral.otf', import.meta.url)
).then((res) => res.arrayBuffer());

const boldFont = fetch(
  new URL('/public/assets/PolySans Bulky.otf', import.meta.url)
).then((res) => res.arrayBuffer());

const formatDate = (dateString: string | number | Date) => {
  //format date ex: if published this year Apr 4, otherwise Apr 4, 2021
  const date = new Date(dateString)
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: true,
  })
  return formattedDate
}
export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const [regular, bold] = await Promise.all([
    regularFont,
    boldFont,
  ]);
  try {
    const { username } = params
    const postUrl = req.nextUrl.searchParams.get("url");
    if (!postUrl) {
      return NextResponse.json("Missing post url", { status: 400 });
    }

    const response = await fetch(`${process.env.DOMAIN}/api/posts/${username}/${postUrl}`);
    if (!response.ok) {
      return NextResponse.json("Error fetching user data", { status: 500 });

    }
    const data = await response.json();
    const post = data;
    return new ImageResponse(
      (
        post.cover ? (
          <div tw="flex flex-col w-full h-full justify-end bg-white" >
            <div tw="absolute flex bg-white w-full h-8 top-0 z-50"></div>
            <img src={post.cover} alt="" />
            <div tw="absolute flex flex-col bg-white py-8 px-14 w-full bottom-0">
              <div tw="text-3xl font-bold w-3/5 mb-4"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
              >{post.title}</div>
              <div tw="flex space-x-4 items-center w-full justify-between">
                <div tw="flex items-center">
                  <img tw="rounded-full w-10 h-10 mr-2 rounded-full" alt="" src={post.author.image} />
                  <div tw="flex flex-col">
                    <div tw="text-base font-bold mb-0 flex items-center">{post.author?.name || post.author?.username} {post.author?.verified &&
                      (
                        <svg viewBox="0 0 22 22" height={"16px"} width={"16px"} fill="1E9CF1" >
                          <g>
                            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="1E9CF1"></path>
                          </g>
                        </svg>
                      )}</div>
                    <div tw="text-sm text-mute-foreground">{post.readingTime + " · " + formatDate(post.createdAt)}</div>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 466.45 466" height="48">
                  <path d="M205.57,232.99H68.75L0,113.71h137.48l0.01,0.03L205.57,232.99z M205.57,232.99l-68.41,118.69L201.32,463 l68.74-119.26l63.83-110.73v-0.01H205.57z M201.32,3L137.5,113.71h265.13L466.45,3H201.32z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div tw="flex flex-col w-full h-full bg-gray-50 justify-end bg-gray-50" >
            <div tw="flex flex-col py-8 px-14">
              <div tw="text-6xl font-bold w-4/5 mb-4 leading-tight"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}>{post.title}</div>
              <div tw="text-3xl w-4/5 mb-6" style={
                {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }
              }>{
                post.subtitle
              }</div>
              <div tw="flex space-x-4 items-center w-full justify-between">
                <div tw="flex">
                  <img tw="rounded-full w-10 h-10 mr-2 rounded-full" alt="" src={post.author?.image as string} />
                  <div tw="flex flex-col">
                    <span tw="text-base font-bold">{post.author?.name || post.author?.username} </span>
                    <div tw="text-sm text-muted-foreground space-x-1.5">{post.readingTime + " · " + formatDate(post.createdAt)}</div>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 466.45 466" height="48">
                  <path d="M205.57,232.99H68.75L0,113.71h137.48l0.01,0.03L205.57,232.99z M205.57,232.99l-68.41,118.69L201.32,463 l68.74-119.26l63.83-110.73v-0.01H205.57z M201.32,3L137.5,113.71h265.13L466.45,3H201.32z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        )
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: regular,
            weight: 400,
          },
          {
            name: 'Inter',
            data: bold,
            weight: 700,
          },
        ],
      },
    );
  } catch (error) {
    console.error(error);
  }
}

/*Type error: Route "app/api/posts/[username]/opengraph-image/route.tsx" has an invalid export:
"Promise<ImageResponse | undefined>" is not a valid GET return type:
Expected "void | Response | Promise<void | Response>", got "Promise<ImageResponse | undefined>".
  Expected "Promise<void | Response>", got "Promise<ImageResponse | undefined>".
    Expected "void | Response", got "ImageResponse | undefined".
      Expected "void | Response", got "ImageResponse".*/