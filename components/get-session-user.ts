'use server'
import { config } from "@/app/auth";
import postgres from "@/lib/postgres";
import { tr } from "date-fns/locale";
import { getServerSession } from "next-auth";
import { cache } from "react";

export async function getSessionUser() {
     const session = await getServerSession(config);
     if (!session) {
          return null
     }
     try {
          const { user } = session;
          const result = await postgres.user.findFirst({
               where: {
                    image: user?.image,
               },
               include: {
                    Followers: {
                         include: {
                              follower: {
                                   include: {
                                        Followers: true,
                                        Followings: true,
                                   },
                              },
                              },
                         },
                    Followings: {
                         include: {
                              following: {
                                   include: {
                                        Followers: true,
                                        Followings: true,
                                   },
                              },
                         },
                    },
                    bookmarks: {
                         include: {
                              post: {
                                   include: {
                                        author: true,
                                   }
                              }
                         }
                    },
                    posts: true,
                    notifications: true,
                    settings: true,
                    tagfollower: {
                         include: {
                              tag: true,
                         }
                    },
                    }
               })
          return JSON.parse(JSON.stringify(result));
     } catch (error) {
          console.error(error);
     }
}