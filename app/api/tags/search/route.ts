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
  const limitString = request.nextUrl.searchParams.get('limit');
  const limit = limitString ? parseInt(limitString) : 5;
  try {
     const tags = await postgres.tag.findMany({
          where: search != undefined ? {
               name: {
                 contains: search.replace(/\s+/g, '-').toLowerCase(),
                 mode: "insensitive",
               },
             } : {},
          take: limit,
          skip: page * limit,
          orderBy: {
            followingtag: {
              _count: "desc",
            },
          },
          include: {
            _count: { select: { posts: true, followingtag: true } },
          },
        });

    return NextResponse.json({ tags: tags }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}