import postgres from '@/lib/postgres'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, res: NextResponse) {
  try {
     const user_id = req.nextUrl.searchParams.get('user') as string
  let page = parseInt(req.nextUrl.searchParams.get('page') || '0', 10)
  let limit = 10
  let offset = 0

  if (page > 0) {
    limit = 5
    offset = (page + 1) * limit 
  }

  // const feed = await sql`
  //   SELECT *
  //   FROM BlogPosts
  //   WHERE authorid IN (
  //     SELECT followeeid
  //     FROM Follows
  //     WHERE followerid = ${user_id}
  //   )
  //   ORDER BY creationdate DESC
  //   LIMIT ${limit} OFFSET ${offset}
  // `
  // const feed = await sql('SELECT * FROM BlogPosts WHERE authorid IN (SELECT followeeid FROM Follows WHERE followerid = $1) ORDER BY creationdate DESC LIMIT $2 OFFSET $3', [user_id, limit, offset])
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
    skip: offset,
    include: {
      author: true,
      _count: {
        select: {
          likes: true,
          comments: true,
          savedUsers: true,
        },
      },
      tags: true,
    }
  })
  //execute algorithm to determine the end of the feed
  // const feedLength = await sql`
  //   SELECT COUNT(*) AS feedlength
  //   FROM BlogPosts
  //   WHERE authorid IN (
  //     SELECT followeeid
  //     FROM Follows
  //     WHERE followerid = ${user_id}
  //   )
  // `;
  const feedLength = feed.length

  //execute a query to fetch the number of comments of the posts
  // const postComments = await sql`
  //   SELECT blogpostid, COUNT(*) AS commentscount
  //   FROM Comments
  //   GROUP BY blogpostid
  // `;

  // const author = await sql`
  //   SELECT *
  //   FROM Users
  //   WHERE userid IN (
  //     SELECT authorid
  //     FROM BlogPosts
  //     WHERE authorid IN (
  //       SELECT followeeid
  //       FROM Follows
  //       WHERE followerid = ${user_id}
  //     )
  //   )
  // `
  

  const popular = await postgres.post.findMany({
    orderBy: {
      views: 'desc',
    },
    take: 5,
    include: {
      author: true,
      _count: {
        select: {
          likes: true,
          comments: true,
          savedUsers: true,
        },
      },
      tags: true,
    }
  })

  return NextResponse.json({ feed, feedLength, popular })
  }
     catch (error) {
     console.error(error)
     return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
     }
}