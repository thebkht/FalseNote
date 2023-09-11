 import type { NextAuthOptions } from 'next-auth'
 import GitHubProvider from 'next-auth/providers/github'
 import CredentialsProvider from 'next-auth/providers/credentials'

 interface User {
     id: string;
     name: string;
     password: string;
   }

 export const options: NextAuthOptions = {
     providers: [
          GitHubProvider(
                 {
                      clientId: process.env.GITHUB_ID as string,
                      clientSecret: process.env.GITHUB_SECRET as string,
                 }
            ),
          CredentialsProvider({
               name: 'Credentials',
               credentials: {
                    username: { label: "Username", type: "text", placeholder: "jsmith" },
                    password: { label: "Password", type: "password" }
               },
               async authorize(credentials) {
                    const user: User = { id: "1", name: 'yusupovbg', password: '123' }

                    if (credentials?.username === user.name && credentials.password === user.password) {
                         return user
                    } else {
                         return null
                    }
               }
          }
          )
     ],
 }