//Init next-auth with github providers
// Path: app/api/auth/options.ts
import NextAuth from "next-auth"
import { config } from "@/app/auth"

const handler = NextAuth(config)
export { handler as GET, handler as POST }