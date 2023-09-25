"use client"
import { useSession } from "next-auth/react"


export async function SessionUser() {
     const { data: session, status } = useSession()
     try {
          const user = await session?.user

          return user
     } catch (error: any) {
          return new Response(error.message, { status: 500 })
     }
} 