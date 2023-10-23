import postgres from '@/lib/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { username: string }}) {
  try {
    // Get the 'slug' route parameter from the request object
    const username = params.username;

    if (username === undefined || username === null) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Execute a query to fetch the specific user by name
    const result = await postgres.user.findFirst({
      include: {
        posts: true,
        Followers: true,
        Following: true,
        notifications: true,
      },
      where: {
        OR: [{username: username}, {name: username}]        
      }
    })

    const posts = await postgres.post.findMany({
      where: {
        authorId: result?.id,
        visibility: "public",
      }
    })

    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: result }, { status: 200 });
  } catch (error) {
      
    return NextResponse.json({ error }, { status: 404 });
  }
}
