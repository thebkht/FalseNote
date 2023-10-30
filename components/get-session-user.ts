'use server'
import { config } from "@/app/auth";
import postgres from "@/lib/postgres";
import { tr } from "date-fns/locale";
import { getServerSession } from "next-auth";
import { cache } from "react";

export async function getSessionUser() {
     const session = await fetch('/api/session', {
          method: 'GET',
          headers: {
               'Content-Type': 'application/json',
          },
     }).then((res) => res.json())

     return session.user
}