//Init next-auth with github providers
// Path: app/api/auth/options.ts

import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
     providers: [
          GitHubProvider({
               clientId: process.env.GITHUB_ID as string,
               clientSecret: process.env.GITHUB_SECRET as string,
          }),
     ],
});

export { handler as GET, handler as POST };

export interface User {
     id: number;
     name: string;
     email: string;
     image: string;
     createdAt: Date;
     updatedAt: Date;
}
