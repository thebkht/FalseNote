import postgres from "@/lib/postgres"
import type { NextAuthOptions as NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"

export const config = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    GitHub({ 
      clientId: process.env.GITHUB_CLIENT_ID, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      
      if (account?.provider === 'github' && user) {
        const { login: username, name, email, bio, html_url: githubProfileURL, avatar_url, location } = profile as any;
  
        console.log("GitHub Profile:", profile);
  
        // Check if the user exists in your database based on their email
        // const userExists = await sql('SELECT * FROM Users WHERE Username = $1;', [username]);
        const userExists = await postgres.user.findMany({
          where: {
            username: username
          }
        })
  
        if (!userExists[0]) {
          if (!username) {
            
            return false; // Do not continue with the sign-in process
          }
          // User doesn't exist, add them to the Users table
          try {
            // await sql('INSERT INTO Users (Username, Name, Email, Bio, GithubProfileURL, AvatarURL, Location) VALUES ($1, $2, $3, $4, $5, $6, $7);', [username, name, email, bio, githubProfileURL, avatar_url, location]);
            await postgres.user.create({
              data: {
                username: username,
                name: name || '',
                email: email || '',
                bio: bio || '',
                githubprofile: githubProfileURL,
                location: location || '',
                image: avatar_url,
                password: ''
              }
            })

            // const sessionUser = await sql('SELECT * FROM Users WHERE Username = $1;', [username]);
            const sessionUser = await postgres.user.findMany({
              where: {
                username: username
              }
            })

            //const userSettingsExists = await sql('SELECT * FROM UserSettings WHERE UserId = $1;', [sessionUser[0].userid]);
            const userSettingsExists = await postgres.userSettings.findMany({
              where: {
                userId: sessionUser[0].id
              }
            })
            if (!userSettingsExists[0]) {
              //await sql('INSERT INTO UserSettings (UserId) VALUES ($1);', [sessionUser[0].userid])
              await postgres.userSettings.create({
                data: {
                  userId: sessionUser[0].id
                }
              })
            }
          } catch (error) {
            console.error("Error inserting user into the database:", error);
            return false; // Do not continue with the sign-in process
          }
        }
      }
      return true; // Continue sign-in process
    },
    // async session({session}) {
    //   const sessionUserName = session.user?.name;
      
    //   try{
    //     const isName = await sql(`SELECT * FROM users WHERE Name = ${sessionUserName}`);

    //     console.log(isName.rows[0])

    //     if(isName.rows[0]){
    //       const updatedSession = {
    //         ...session,
    //         user: {
    //           ...session.user,
    //           name: isName.rows[0].Username as string,
    //         },
    //       };
    
    //       return updatedSession;
    //     }
    //     console.log("Name changed to username")
    //   } catch(error){
    //     console.error("Error there is no user:", error);
            
    //   } return session;
    // },
  },
  
} satisfies NextAuthConfig

// // Helper function to get session without passing config every time
// // https://next-auth.js.org/configuration/nextjs#getserversession
// export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
//   return getServerSession(...args, config)
// }

// We recommend doing your own environment variable validation
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NEXTAUTH_SECRET: string

      GITHUB_CLIENT_ID: string
      GITHUB_CLIENT_SECRET: string
    }
  }
}