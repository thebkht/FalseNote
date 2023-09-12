//Init next-auth with github providers
// Path: app/api/auth/options.ts

import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { sql } from '@vercel/postgres';

const handler = NextAuth({
     providers: [
          GitHubProvider({
               clientId: process.env.GITHUB_ID as string,
               clientSecret: process.env.GITHUB_SECRET as string,
          }),
     ],
     callbacks: {
          async signIn({ user, account, profile }) {
            if (account?.provider === 'github' && user) {
               const { username, name, email, bio, html_url: githubProfileURL } : {
                    username: string;
                    name: string;
                    email: string;
                    bio: string;
                    html_url: string;
                  } = profile as any;
              // Check if the user exists in your database based on their email
              const userExists = await sql`
                SELECT * FROM Users
                WHERE Email = ${email};
              `;
      
              if (!userExists.rows[0]) {
                // User doesn't exist, add them to the Users table
                await sql`
                  INSERT INTO Users (Username, Name, Email, GitHubProfileURL)
                  VALUES (${username}, ${name}, ${email}, ${githubProfileURL});
                `;
              }
            }
      
            return true; // Continue with the sign-in process
          },
        },
});

export { handler as GET, handler as POST };