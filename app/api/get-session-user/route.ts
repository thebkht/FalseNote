import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { useSession } from 'next-auth/react'

export async function GET(request: Request) {
  try {
     const session = useSession();
     const name = session.data?.user?.name;
    // Execute a query to fetch all table names
    const result = await sql`
      SELECT * FROM users WHERE Name = ${name} OR Username = ${name}
    `;

    return NextResponse.json({ result }, { status: 200});
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
