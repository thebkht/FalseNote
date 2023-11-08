import postgres from '@/lib/postgres';
import { NextRequest, NextResponse } from 'next/server';

const baseQuery = {
  include: {
     Followers: true,
     Followings: true,
  },
};

export async function GET(request: NextRequest) {
  const pageString = request.nextUrl.searchParams.get('page');
  const page = pageString ? parseInt(pageString) : 0;
  const search = request.nextUrl.searchParams.get('search');
  const limit = 5;
  try {
    const users = (await postgres.user.findMany({
      ...baseQuery,
      where:
        search != undefined
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  username: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
      take: limit,
      skip: page * limit,
      include: {
        Followers: true,
        Followings: true,
        _count: {
          select: {
            Followers: true,
            posts: true,
          },
        }
      },
    }));
    
    // Sort the results in your application code
    users.sort((a, b) => {
      const aCount = a._count.Followers + a._count.posts;
      const bCount = b._count.Followers + b._count.posts;
    
      return bCount - aCount;
    });
    return NextResponse.json({ users: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}