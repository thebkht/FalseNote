"use client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session) {
    const githubImageUrl = session?.user?.image || "";
    const userId = githubImageUrl.match(/\/(\d+)\?v=4/)[1]; // Extract GitHub user ID

    // Make a GET request to the GitHub API to fetch user information
    const githubApiUrl = `https://api.github.com/user/${userId}`;
    const response = await fetch(githubApiUrl, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`, // Include the user's GitHub access token
      },
    });

    if (response.status === 200) {
      const userData = await response.json();
      const githubUsername = userData.login; // Extract GitHub username
      res.status(200).json({ username: githubUsername });
    } else {
      // Handle API error
      res.status(response.status).json({ error: "Failed to fetch user information" });
    }
  } else {
    // The user is not signed in
    res.status(401).json({ error: "Unauthorized" });
  }
};
export { handler as GET, handler as POST };