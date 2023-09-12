import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    res.status(200).json({ tables });
  } catch (error) {
    // Handle any errors that occur during the query
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
