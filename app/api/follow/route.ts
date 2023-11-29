import { NextRequest, NextResponse } from "next/server";
import postgres from "@/lib/postgres";
import { create } from "@/lib/notifications/create-notification";

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

      // if followed during 1 week, delete notification
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      if (isFollowed.createdAt > oneWeekAgo) {
        const notification = await postgres.notification.findFirst({
          where: {
            senderId: followerId,
            receiverId: followeeId,
            type: "follow",
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
          },
        });

        if (notification) {
          await postgres.notification.delete({
            where: {
              id: notification.id,
            },
          });
        }
      }

      return NextResponse.json({ message: "unfollowed" }, { status: 200 });
    } else {
      await postgres.follow.create({
        data: {
          followerId: followerId,
          followingId: followeeId,
        },
      });

      // Check if followerId and followeeId are not null
      if (followerId && followeeId) {
        //Create notification
        const sender = await postgres.user.findUnique({
          where: {
            id: followerId,
          },
        });

        const receiver = await postgres.user.findUnique({
          where: {
            id: followeeId,
          },
        });

        // Check if sender and receiver are not null
        if (sender && receiver) {
          const message = `${sender?.name || sender?.username} followed you`;
          const type = "follow";
          const url = `/@${sender?.username}`;
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
