import { getSession } from "next-auth/react";

//Get session user using getSession() from next-auth and return user object
export async function getSessionUser() {
     const session = await getSession();
     const sessionUser = session?.user;

     //Get user details from database
     const user = await fetch("/api/users/" + sessionUser?.name?.replace(/\s/g, ""));
     //Convert user details to JSON and return user object with details from database as a object
     const userJson = await user.json();
     //userJson returns user: {id: 1, name: "John Doe", email: "john.doe@gmail", ...}
     const userObject = userJson.user;
     const userid = userObject.userid;

     return { userObject, userid };
}