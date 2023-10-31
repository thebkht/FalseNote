import { cache } from "react";

async function fetchSessionUser() {
     try {
          const session = await fetch(`${process.env.DOMAIN}/api/session`).then((res) => res.json());
          if (session.error) {
               return null;
          }
          console.log(process.env.DOMAIN);
          return session.user;
     } catch (error) {
          console.error("Failed to get session:", error);
          return null;
     }
}

export const getSessionUser = cache(() => fetchSessionUser());
