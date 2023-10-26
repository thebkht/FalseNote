import { getSession } from "next-auth/react";
import { cache } from "react";

//Get session user using getSession() from next-auth and return user object
async function fetchData() {
     const session = await getSession();
     console.log(session);
     const sessionUser = session?.user as any;
     //If there is no session user return null
     if (!sessionUser) {
          return Promise.resolve(null);
     }

     try {
          //Get user details from database
     const username = encodeURIComponent(sessionUser?.name);
     //By some cases username might be "Bakhtiyor Ganijon" request must be "Bakhtiyor%20Ganijon"
     const user = await fetch(`/api/users/${username}`);
     //Convert user details to JSON and return user object with details from database as a object
     const userJson = await user.json();

     return Promise.resolve(userJson.user);
     } catch (error) {
          //If there is no user details in database return null
          return Promise.reject(null);
     }
}

export const getSessionUser = cache(fetchData)