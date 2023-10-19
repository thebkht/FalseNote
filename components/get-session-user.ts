import { getSession } from "next-auth/react";

//Get session user using getSession() from next-auth and return user object
export async function getSessionUser() {
     const session = await getSession();
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
     /*userJson returns user: {
      userid: 31,
      username: 'falsetech',
      name: null,
      bio: null,
      email: null,
      password: null,
      profilepicture: 'https://avatars.githubusercontent.com/u/144859178?v=4',
      githubprofileurl: 'https://github.com/falsetech',
      registrationdate: 2023-09-13T06:28:11.085Z,
      location: null,
      verified: true,
      followersnum: '1',
      followingnum: '1',
      posts: [],
      postsnum: '0',
      comments: [],
      followers: [Array],
      following: [Array]
    } 
    it must return userJson.user to get the user object

    */
     return Promise.resolve(userJson);
     } catch (error) {
          //If there is no user details in database return null
          return Promise.reject(null);
     }
}