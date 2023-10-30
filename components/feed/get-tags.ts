import postgres from "@/lib/postgres"
import { getSessionUser } from "../get-session-user"

export const fetchTags = async (query?: string) => {
     try {
          const user = await getSessionUser()
     if (!user) {
          const tags = await postgres.tag.findMany({
               orderBy: {
                    followingtag: {
                         _count: "desc"
                    }
               },
               take: 5
          })
          await new Promise(resolve => setTimeout(resolve, 750))
          return { tags: JSON.parse(JSON.stringify(tags)) }
     } else {
     const { userId } = user.id
     const tags = await postgres.tag.findMany({
          where: {
               followingtag: {
                    none: {
                         followerId: userId
                    }
               }
          },
          orderBy: {
               followingtag: {
                    _count: "desc"
               }
          },
          take: 5
     })
     
     return { tags: JSON.parse(JSON.stringify(tags)) }
     }
     } catch (error) {
          return { error }
     }
}