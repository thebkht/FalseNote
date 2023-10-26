'use server'
import { config } from "@/app/auth";
import postgres from "@/lib/postgres";
import { getServerSession } from "next-auth";
import { cache } from "react";

export async function getSessionUser() {
     const session = await getServerSession(config);
     if (!session) {
          return null
     }
     try {
          const { user } = session;
          const result = await fetch(`${process.env.DOMAIN}/api/users/${encodeURIComponent(user?.name as string)}`);
          const data = await result.json();
          return data.user;
     } catch (error) {
          console.error(error);
     }
}