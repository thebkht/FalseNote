import { config } from '@/app/auth'
import postgres from '@/lib/postgres'
import { getFeed } from '@/lib/prisma/feed';
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const pageString = req.nextUrl.searchParams.get('page') || 0
  const page = Number(pageString)
  const tag = req.nextUrl.searchParams.get('tag') as string | undefined
  const session = await getServerSession(config)
  if (!session) {
    return NextResponse.json({ error: 'No user found' }, { status: 500 })
  }
  const user = session?.user
  const res = await postgres.user.findFirst({
    where: { image: user?.image },
    select: { id: true },
  })
  const id = res?.id
  if (!id) {
    return NextResponse.json({ error: 'No user found' }, { status: 500 })
  }

  const feed = await getFeed({ page, tab: tag, limit: 10 });
  if (feed?.error) {
    return NextResponse.json({ error: feed.error }, { status: 500 });
  } else if (feed?.feed) {
    return NextResponse.json({ feed: feed.feed }, { status: 200 });
  }
}