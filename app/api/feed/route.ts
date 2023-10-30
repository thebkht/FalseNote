import postgres from '@/lib/postgres'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const pageString = req.nextUrl.searchParams.get('page') || 0
  const page = Number(pageString)
  const tag = req.nextUrl.searchParams.get('tag')
  const idString = req.nextUrl.searchParams.get('id')
  console.log("received data: ", pageString, tag, idString)
  if (!idString) {
    return NextResponse.json({ error: 'No user found' }, { status: 500 })
  }
  const id = Number(idString)
  if (tag) {
    const postTags = await postgres.postTag.findMany({
      select: { postId: true },
      where: { tag: { name: { equals: tag } } },
    });
    const postIds = postTags.map((postTag) => postTag.postId);
    return fetchFeed({
      where: { id: { in: postIds } },
      orderBy: { createdAt: "desc" },
      take: 5,
      skip: page * 5,
      include: {
        author: {
          include: {
            Followers: true,
            Followings: true,
          },
        },
        _count: {
          select: {
            likes: true,
            savedUsers: true,
          },
        },
        tags: {
          take: 1,
          include: {
            tag: true,
          },
        },
      },
    });
  } else {
    const following = await postgres.follow.findMany({
      select: { followingId: true },
      where: { followerId: id },
    });
    const followingIds = following.map((user) => user.followingId);
    return fetchFeed({
      where: { authorId: { in: followingIds } },
      orderBy: { createdAt: "desc" },
      take: 5,
      skip: page * 5,
      include: {
        author: {
          include: {
            Followers: true,
            Followings: true,
          },
        },
        _count: {
          select: {
            likes: true,
            savedUsers: true,
          },
        },
        tags: {
          take: 1,
          include: {
            tag: true,
          },
        },
      },
    });
  }
}

const fetchFeed = async (query: any) => {
  try {
    const feed = await postgres.post.findMany(query);
    await new Promise((resolve) => setTimeout(resolve, 750));
    return NextResponse.json({ feed: feed}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
