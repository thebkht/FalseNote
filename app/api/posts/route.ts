import { config } from "@/app/auth";
import { getSessionUser } from "@/components/get-session-user";
import postgres from "@/lib/postgres";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ObjectId } from 'bson';

const id = new ObjectId().toHexString();

const baseQuery = {
  include: {
    author: true,
    savedUsers: true,
    _count: {
      select: {
        likes: true,
        savedUsers: true,
        readedUsers: true,
      },
    },
    tags: {
      take: 1,
      include: {
        tag: true,
      },
    },
  },
};

export async function GET(req: NextRequest) {
  const pageString = req.nextUrl.searchParams.get("page");
  const page = pageString ? parseInt(pageString) : 0;
  const search = req.nextUrl.searchParams.get("search");
  const limit = 5;

  try {
    const posts = await postgres.post.findMany({
      ...baseQuery,
      where: search
        ? {
            /* OR: [
                         {
                              title: {
                                   contains: search,
                                   mode: "insensitive",
                              },
                         },
                         {
                              content: {
                                   contains: search,
                                   mode: "insensitive",
                              },
                         },
                    ], */
            title: {
              contains: search,
              mode: "insensitive",
            },
            published: true,
          }
        : { published: true },
      take: limit,
      skip: page * limit,
    });

    // Sort the results in your application code
    posts.sort((a, b) => {
      const aCount =
        a._count.likes + a._count.savedUsers + a._count.readedUsers;
      const bCount =
        b._count.likes + b._count.savedUsers + b._count.readedUsers;

      return bCount - aCount;
    });

    return NextResponse.json({ posts: posts }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    // If user is on a free plan.
    // Check if user has reached limit of 3 posts.

    const json = await req.json();

    const post = await postgres.post.create({
      data: {
        id: id,
        title: json.title,
        content: json.content,
        authorId: session.id,
        url: json.url,
      },
      select: {
        id: true,
      },
    });

    return new Response(JSON.stringify(post));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
