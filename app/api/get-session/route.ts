// import type { NextApiRequest, NextApiResponse } from "next";
// import { getSession } from "next-auth/react";
// import { Profile } from "next-auth";
// import { sql } from "@vercel/postgres";

// async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const session = await getSession({ req });
//     if (!session) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     // Assuming you have user data in the session
//     const user = session.user as Profile;
//     console.log("User-sub:", user.sub);
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// }


// export { GET: handler, POST : handler}