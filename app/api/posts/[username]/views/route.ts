// pages/api/some-route.ts
import { NextRequest, NextResponse } from 'next/server';
import { incrementPostViews } from '@/components/blog/actions';

export default async function POST(req: NextRequest, res: NextResponse) {
  const { post } = await req.json();
  const { author } = await req.json();

  const cookie = await incrementPostViews({ post, author });

  // Set the cookie
  res.cookies.set(cookie)

  return NextResponse.json({ message: 'Post view incremented' }, { status: 200 });
}