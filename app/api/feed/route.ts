import { sql } from '@/lib/postgres'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, res: NextResponse) {
  try {
     const user_id = req.nextUrl.searchParams.get('user')
  let page = parseInt(req.nextUrl.searchParams.get('page') || '0', 10)
  let limit = 10
  let offset = 0

  if (page > 0) {
    limit = 5
    offset = (page + 1) * limit 
  }

  const feed = await sql`
    SELECT *
    FROM BlogPosts
    WHERE authorid IN (
      SELECT followeeid
      FROM Follows
      WHERE followerid = ${user_id}
    )
    ORDER BY creationdate DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  //execute algorithm to determine the end of the feed
  const feedLength = await sql`
    SELECT COUNT(*) AS feedlength
    FROM BlogPosts
    WHERE authorid IN (
      SELECT followeeid
      FROM Follows
      WHERE followerid = ${user_id}
    )
  `;

  //execute a query to fetch the number of comments of the posts
  const postComments = await sql`
    SELECT blogpostid, COUNT(*) AS commentscount
    FROM Comments
    GROUP BY blogpostid
  `;

  console.log("posts comments", postComments);
        
  feed.forEach((post: any) => {
    postComments.forEach((comment: any) => {
      if (post.postid === comment.blogpostid) {
        post.comments = comment.commentscount;
      }
    }
    )
  }
  )

  const author = await sql`
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

  const popular = await sql`
    SELECT *
    FROM BlogPosts
    ORDER BY views DESC
    LIMIT 5
  `

  const popularAuthor = await sql`
    SELECT *
    FROM Users
    WHERE userid IN (
      SELECT authorid
      FROM BlogPosts
      ORDER BY likes DESC
      LIMIT 5
    )
  `

  popular.forEach((post: any) => {
    popularAuthor.forEach((user: any) => {
      if (post.authorid === user.userid) {
        post.author = user
      }
    })
  })

  return NextResponse.json({ feed, feedLength, popular })
  }
     catch (error) {
     console.error(error)
     return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
     }
}