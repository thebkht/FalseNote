'use server'

import { config } from "@/app/auth"
import { getServerSession } from "next-auth"

export async function getSessionUser() {
     try {
          const sessionUser = await getServerSession(config)
     if (!sessionUser) {
          return null
     }
     const { user } = sessionUser
     const session = await fetch(`${process.env.DOMAIN}/api/session`, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user })
     }).then((res) => res.json())
     if (session.error) {
          return null
     }
     return session.user
     } catch (error) {
          console.error('Failed to get session:', error);
          return null;
        }
}

export async function getServerSideProps() {
     const sessionUser = await getSessionUser();
     return {
       props: {
         sessionUser
       }
     }
   }