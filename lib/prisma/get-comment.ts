'use server'

import { Comment } from "@prisma/client"
import postgres from "../postgres"

export const getComment = async (id: Comment['id']) => {
     return await postgres.comment.findUnique({
     where: {
          id: id
     },
     include: {
          author: {
               include: {
                    Followers: true,
                    Followings: true
               }
          },
          replies: {
               include: {
                    author: {
                         include: {
                              Followers: true,
                              Followings: true
                         }
                    },
                    _count: { select: { replies: true, likes: true } },
                    likes: true,
               },
          },
          _count: { select: { replies: true, likes: true } },
          likes: true,
     },
     })
}