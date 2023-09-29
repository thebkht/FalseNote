import { sql } from "@vercel/postgres"

export async function GET(request: Request) {
     await sql`
          UPDATE Users
          SET falsemember = true
          WHERE userid IN (SELECT FolloweeID FROM Follows WHERE FollowerID = 31)
          `
}