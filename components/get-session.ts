import { cache } from "react";

async function fetchSessionUser() {
  try {
     const session = await fetch("/api/session").then((res) => res.json());
     if (!session) {
       return null;
     }
     const { user } = session;
     return user;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export const getSessionUser = cache(fetchSessionUser)