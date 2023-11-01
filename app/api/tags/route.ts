import { config } from "@/app/auth";
import postgres from "@/lib/postgres";
import { tr } from "date-fns/locale";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pageString = req.nextUrl.searchParams.get("page") || 0;
  const page = Number(pageString);
  let id;

  try {
    const session = await getServerSession(config);
    if (session) {
      const user = session?.user;
      const res = await postgres.user.findFirst({
        where: { image: user?.image },
        select: { id: true },
      });
      id = res?.id;
    }

    const whereClause =
      id !== undefined
        ? {
            followingtag: {
              none: {
                followerId: id,
              },
            },
          }
        : {};

    const tags = await postgres.tag.findMany({
      where: whereClause,
      take: 10,
      skip: page * 10,
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      include: {
        _count: { select: { posts: true, followingtag: true } },
        followingtag: true,
      },
    });
    return NextResponse.json({ tags: tags }, { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to get tag", { status: 500 });
  }
}
