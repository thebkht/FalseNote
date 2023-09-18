import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Profile } from "next-auth";
import { sql } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Assuming you have user data in the session
    const user = session.user as Profile;
    console.log("User-sub:", user.sub);

    // Extract post data from the request body
    const { title, content, visibility, topics } = req.body;

    // Validate and sanitize the data as needed

    // Insert the post data into the database
    const result = await sql`
        INSERT INTO posts (user_id, title, content, visibility, topics)
        VALUES (
          (SELECT user_id FROM users WHERE username = ${user.name}),
          ${title},
          ${content},
          ${visibility},
          ${topics}
        )
        RETURNING *
      `
      .then((result) => result);

    // Check if the insertion was successful
    if (result.rowCount === 1) {
      return res.status(201).json({ message: "Post submitted successfully", post: result.rows[0] });
    } else {
      return res.status(500).json({ error: "Failed to insert post into the database" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
