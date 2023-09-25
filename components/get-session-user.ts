import { getSession } from "next-auth/react";

//Get session user using getSession() from next-auth and return user object
export async function getSessionUser() {
     const session = await getSession();
     const sessionUser = session?.user;

     //Get user details from database
     const user = await fetch("/api/users/" + sessionUser?.name?.replace(/\s/g, ""));
     const userJson = await user.json();

     //Return user object
     return userJson.user;
}