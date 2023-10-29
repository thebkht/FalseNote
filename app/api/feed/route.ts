import postgres from '@/lib/postgres'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, res: NextResponse) {
  try {
     const user_id = Number(req.nextUrl.searchParams.get('user'))
  let page = parseInt(req.nextUrl.searchParams.get('page')!)
  let limit = 5
  let offset = 0

  const userFollowings = await postgres.follow.findMany({
    select: {
      followingId: true,
    },
    where: {
      followerId: user_id,
    },
  })
  const feed = await postgres.post.findMany({
    where: {
      authorId: {
        in: userFollowings.map((user) => user.followingId),
        },
      },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: page * limit,
    include: {
      author: {
        include: {
          Followers: true,
          Followings: true,
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          savedUsers: true,
        },
      },
      tags: {
        take: 1,
        include: {
             tag: true,
        },
   },
    }
  })

  return NextResponse.json({ feed }, { status: 200 })
  }
     catch (error) {
     console.error(error)
     return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
     }
}