import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export default async function GET(request: Request) {
  try {
    // Execute a query to fetch all table names
    const result = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    // Extract the table names from the query result
    const tables = result.rows.map((row) => row.table_name);

    // Respond with the list of tables
    return NextResponse.json({ tables }, { status: 200});
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
