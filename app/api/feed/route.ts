import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, res: NextResponse) {
  try {
     const user_id = req.nextUrl.searchParams.get('user')
  let page = parseInt(req.nextUrl.searchParams.get('page') || '0', 10)
  let limit = 10

  if (page >= 0) {
    limit = 5
  }

  const { rows: feed } = await sql`
    SELECT *
    FROM BlogPosts
    WHERE authorid IN (
      SELECT followeeid
      FROM Follows
      WHERE followerid = ${user_id}
    )
    ORDER BY creationdate DESC
    LIMIT ${limit} OFFSET ${page * 10}
  `

  const { rows: author } = await sql`
    SELECT *
    FROM Users
    WHERE userid IN (
      SELECT authorid
      FROM BlogPosts
      WHERE authorid IN (
        SELECT followeeid
        FROM Follows
        WHERE followerid = ${user_id}
      )
    )
  `

  feed.forEach((post: any) => {
    author.forEach((user: any) => {
      if (post.authorid === user.userid) {
        post.author = user
      }
    })
  })

  const { rows: popular } = await sql`
    SELECT *
    FROM BlogPosts
    ORDER BY likes DESC
    LIMIT 10
  `

  return NextResponse.json({ feed, popular })
  }
     catch (error) {
     console.error(error)
     return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
     }
}