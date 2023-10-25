import postgres from '@/lib/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.searchParams.get("id"));
    if (id) {
      const user = await postgres.user.findUnique({
        where: {
          id: id
        }
      })
    return NextResponse.json({ user: user }, { status: 200});
    } else {
      const result = await postgres.user.findMany()
      const user = result;
      return NextResponse.json({ user }, { status: 200});
    }
    // Execute a query to fetch all table name

    

    
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}