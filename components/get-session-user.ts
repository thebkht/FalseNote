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
          const result = await postgres.user.findFirst({
               where: {
                    image: user?.image,
               }
          });
          return JSON.parse(JSON.stringify(result));
     } catch (error) {
          console.error(error);
     }
}