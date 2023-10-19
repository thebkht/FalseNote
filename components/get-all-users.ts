import { sql } from "@/lib/postgres";

export default async function getAllUsers() {
  const rows = await sql`
     SELECT username FROM users
       `;
     
     //return usernames
     return rows;
}