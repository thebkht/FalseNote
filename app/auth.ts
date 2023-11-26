import postgres from "@/lib/postgres"
import type { NextAuthOptions as NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { ObjectId } from 'bson';

const id = new ObjectId().toHexString();

export const config = {
  // https://next-auth.js.org/configuration/providers/oauth
  //adapter: PrismaAdapter(postgres as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    GitHub({ 
      clientId: process.env.GITHUB_CLIENT_ID, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      
      if (account?.provider === 'github' && user) {
        const { login: username, name, email, bio, html_url: githubProfileURL, avatar_url, location, id: githubId } = profile as any;
        if (!username) {
            
          return false; // Do not continue with the sign-in process
        }
        console.log("GitHub Profile:", profile);
  
        // Check if the user exists in your database based on their email
        const userExists = await postgres.user.findFirst({
          where: {
            githubId: githubId.toString()
          }
        })
  
        if (!userExists) {
          
          // User doesn't exist, add them to the Users table
          try {
            const sessionUser = await postgres.user.create({
              data: {
                id: id,
                username: username,
                name: name,
                email: email,
                bio: bio,
                githubprofile: githubProfileURL,
                location: location,
                image: avatar_url,
                githubId: githubId.toString()
              },
              select: {
                id: true
              }
            })

            const userSettingsExists = await postgres.userSettings.findFirst({
              where: {
                userId: sessionUser.id
              }
            })
            if (!userSettingsExists) {
              await postgres.userSettings.create({
                data: {
                  id: new ObjectId().toHexString(),
                  userId: sessionUser.id
                }
              })
            }
          } catch (error) {
            console.error("Error inserting user into the database:", error);
            return false; // Do not continue with the sign-in process
          }
        }
      }
      return true; // Continue sign-in process
    },
    async jwt({ token, user }) {
      const dbUser = await postgres.user.findFirst({
        where: {
          email: token.email,
          image: token.picture,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        username: dbUser.username,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    async session({ token, session }) {
      if (token) {
        session.user = session.user ?? {};
        session.user.name = token.username as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }

      return session;
    },
  },
  
} satisfies NextAuthConfig

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