import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET({ req, params }: { params: { slug: string }, req: Request }) {
  try {
    // Get the 'name' route parameter from the request object
    const name  = params.slug;

    // Execute a query to fetch the specific user by name
    const result = await sql`
      SELECT * FROM users WHERE Name = ${name} OR Username = ${name}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: result.rows[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

