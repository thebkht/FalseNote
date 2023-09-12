import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Execute a query to fetch all table names
    const result = await sql`
      SELECT * FROM users
    `;

    return NextResponse.json({ result }, { status: 200});
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
