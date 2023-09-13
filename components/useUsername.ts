import { useEffect, useState } from 'react';
import { sql } from "@vercel/postgres"

//useUsernameProps
export function useUsername(
     { params }: { params: { name: string } }
) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    async function fetchUsername() {
      try {
          const result = await sql`
            SELECT Username
            FROM users
            WHERE Username = ${params.name}
               OR Name = ${params.name}`;
        setUsername(result.rows[0]?.Username);
      } catch (error) {
        console.error('Error fetching username:', error);
        setUsername(null);
      }
    }

    fetchUsername();
}, [params.name]);

  return username;
}
