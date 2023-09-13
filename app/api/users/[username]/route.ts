import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { username: string }}) {
  try {
    // Get the 'slug' route parameter from the request object
    const username = params.username;
    console.log(username)

    // Execute a query to fetch the specific user by name
    const result = await sql`
      SELECT * FROM users WHERE Name = ${username} OR Username = ${username}
    `;

    console.log(result)

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: result.rows[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
