import NextAuth from "next-auth/next";
import type { NextAuthOptions } from "next-auth";

import GithubProvider from "next-auth/providers/github";

const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };