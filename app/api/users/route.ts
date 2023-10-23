import postgres from '@/lib/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (id) {
      const user = await postgres.user.findUnique({
        where: {
          id: Number(id)
        }
      })
    return NextResponse.json({ user: user }, { status: 200});
    } else {
      const result = await postgres.user.findMany()

    const user = result;
    }
    // Execute a query to fetch all table name

    

    
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}