import { NextRequest, NextResponse } from "next/server";
import postgres from "@/lib/postgres";
import { create } from "@/lib/notifications/create-notification";
import { ObjectId } from "bson";

export async function GET(request: NextRequest) {
  try {
    const followeeId = request.nextUrl.searchParams.get("followeeId");
    const followerId = request.nextUrl.searchParams.get("followerId");

    if (!followeeId || !followerId) {
      return new Response(
        "followeeId and followerId are required query parameters",
        { status: 400 }
      );
    }

    const isFollowed = await postgres.follow.findFirst({
      where: {
        followerId: followerId,
        followingId: followeeId,
      },
    });

    if (isFollowed) {
      await postgres.follow.deleteMany({
        where: {
          followerId: followerId,
          followingId: followeeId,
        },
      });

      return NextResponse.json({ message: "unfollowed" }, { status: 200 });
    } else {
      await postgres.follow.create({
        data: {
          id: new ObjectId().toHexString(),
          followerId: followerId,
          followingId: followeeId,
        },
      });

      // Check if followerId and followeeId are not null
      if (followerId && followeeId) {
          //Create notification
          const sender = await postgres.user.findUnique({
            where: {
              id: followerId || "",
            },
          });
  
          const receiver = await postgres.user.findUnique({
            where: {
              id: followeeId || "",
            },
          });
          
          // Check if sender and receiver are not null
          if (sender && receiver) {
            const message = `${sender?.name || sender?.username} followed you`;
            const type = "follow";
            const url = `/@${sender?.username}`
            await create({
              content: message,
              type,
              url,
              receiverId: receiver?.id || "",
              senderId: sender?.id || "",
            });
          }
        }

      return NextResponse.json({ message: "followed" }, { status: 200 });
    }
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
