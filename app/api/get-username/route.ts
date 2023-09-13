import { config } from "@/app/auth";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export default async function handler() {
     
} async (req : Request, res: Response) => {
  try {
    // Get the user's session from the server-side
    const session = await getServerSession(config);

    // Retrieve the user session data, assuming you are using NextAuth.js
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401});
    }

    // Define the SQL query to retrieve the username
    const usernameQuery = await sql`
      SELECT Username
      FROM Users
      WHERE Username = ${user.name}
         OR Name = ${user.name};
    `;

    const username = usernameQuery.rows[0]?.Username;

    if (!username) {
      return NextResponse.json({ error: "Username not found" }, {status: 401});
    }

    // Return the username as a JSON response
    return NextResponse.json({ username }, {status: 200});
  } catch (error) {
    console.error("Error getting username:", error);
    return NextResponse.json({ error: "Internal server error" }, {status: 500});
  }
};
