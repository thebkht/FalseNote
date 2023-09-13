import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react'; // Remove GetSessionParams

export async function getServerSideProps(context: any) {
  try {
    const { req, res } = context;

    // Get the user's session from the server-side
    const session = await getSession({ req });

    // Retrieve the user's name from the session
    const name = session?.user?.name;

    if (!name) {
      // Handle the case where the user is not authenticated
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Execute a query to fetch data based on the user's name
    const result = await sql`
      SELECT * FROM users WHERE Name = ${name} OR Username = ${name}
    `;

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
