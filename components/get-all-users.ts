import { sql } from "@vercel/postgres";

export default async function getAllUsers() {
  const { rows } = await sql`
     SELECT * FROM users
       `;
     
     //return usernames
     return rows.map((row) => {
       return {
         username: row.username
       };
     });
}