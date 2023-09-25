"use client"
import { useSession } from "next-auth/react"


export async function SessionUser() {
     const { data: session } = useSession()
     try {
          const user = await session?.user
          const encodedString = user?.name?.replace(/ /g, "%20");
          const response = await fetch(`/api/users/${encodedString}`, { method: "GET", })
          const data = await response.json()
          return data.user
     } catch (error: any) {
          return new Response(error.message, { status: 500 })
     }
} 