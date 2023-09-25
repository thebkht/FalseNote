import { useEffect, useState } from 'react';
import { sql } from "@vercel/postgres"

export function useUsername(
     { params }: { params: { name?: string } }
) {
  const [username, setUsername] = useState(null);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    async function fetchUsername() {
      try {
          const result = await sql`
            SELECT Username
            FROM users
            WHERE Username = ${params.name}
               OR Name = ${params.name}`;
        setUsername(result.rows[0]?.Username);
        async function fetchFollowers() {
          try {
              const follower = await sql`
              SELECT COUNT(*) AS followerCount FROM Follows WHERE FolloweeID= ${result.rows[0]?.userid}`;
            setFollowers(follower.rows[0]?.followercount);
          } catch (error) {
            console.error('Error:', error);
          }
        }
    
        fetchFollowers();
      } catch (error) {
        console.error('Error fetching username:', error);
        setUsername(null);
      }
    }

    fetchUsername();
}, [params.name]);

  return { username, followers };
}
