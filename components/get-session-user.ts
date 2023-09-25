"use client"
import { getSession } from 'next-auth/react'

const session = getSession() as any

export async function SessionUser() {
     try {
          const user = await session.user
          return user
     } catch (error: any) {
          return new Response(error.message, { status: 500 })
     }
} 