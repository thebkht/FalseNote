import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Execute a query to fetch all table names
    const result = await sql`
      SELECT * FROM users
    `;

    const users = result.rows;

    console.log(users);
    return NextResponse.json({ users }, { status: 200});
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function getUser(request: NextRequest) {
  try {
    // Execute a query to fetch all table names
    const result = await sql`
      SELECT * FROM users WHERE Username = ${request.nextUrl.searchParams.get('username')}
    `;

    const users = result.rows;

    console.log(users);
    return NextResponse.json({ users }, { status: 200});
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}