import { sql } from "@vercel/postgres"
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import type { NextAuthOptions as NextAuthConfig } from "next-auth"
import { getServerSession } from "next-auth"
import { Profile } from "next-auth"


import GitHub from "next-auth/providers/github"

export const config = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    GitHub({ clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github' && user) {
        const { login: username, name, email, bio, html_url: githubProfileURL, avatar_url, location } = profile as any;
  
        console.log("GitHub Profile:", profile);
  
        // Check if the user exists in your database based on their email
        const userExists = await sql`
          SELECT * FROM Users
          WHERE Username = ${username};
        `;
  
        if (!userExists.rows[0]) {
          if (!username) {
            console.error("GitHub username is null. Cannot insert user into the database.");
            return false; // Do not continue with the sign-in process
          }
  
          // Check if bio is null, and if so, set it to an empty string
        const sanitizedBio = bio || "";
          // User doesn't exist, add them to the Users table
          try {
            await sql`
              INSERT INTO users (Username, Name, Email, GitHubProfileURL, Bio, Profilepicture, Location)
              VALUES (${username}, ${name}, ${email}, ${githubProfileURL}, ${sanitizedBio}, ${avatar_url}, ${location});
            `;
            console.log(`User '${username}' added to the database.`);

            const sessionUser = await sql`
              SELECT Userid FROM users
              WHERE Username = ${username};
            `;

            console.log("Session User:", sessionUser.rows[0]);

            const userId = sessionUser.rows[0].userid;
            console.log("User ID:", userId);

            const userSettingsExists = await sql`
              SELECT * FROM usersettings
              WHERE Userid = ${ userId };
            `;
            if (!userSettingsExists.rows[0]) {
              await sql`
                INSERT INTO UserSettings (UserId) VALUEs (${ userId });
              `;
              console.log(`User '${username}' added to the usersettings table.`);
            }

          } catch (error) {
            console.error("Error inserting user into the database:", error);
            return false; // Do not continue with the sign-in process
          }
        }
      }
  
      return true; // Continue with the sign-in process
    },
    async jwt({ token, user, account, profile }) {
      console.log(profile);
      return token
    }
  },
  
} satisfies NextAuthConfig

// Helper function to get session without passing config every time
// https://next-auth.js.org/configuration/nextjs#getserversession
export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, config)
}

// We recommend doing your own environment variable validation
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NEXTAUTH_SECRET: string

      GITHUB_CLIENT_ID: string
      GITHUB_CLIENT_SECRET: string
    }
  }
}