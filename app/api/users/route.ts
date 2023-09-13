import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Execute a query to fetch all table names
    const result = await sql`
      SELECT * FROM users
    `;

    const users = result.rows;

    return NextResponse.json({ users }, { status: 200});
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
