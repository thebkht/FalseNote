import { config } from "@/app/auth";
import postgres from "@/lib/postgres";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
     try {
          const sessionUser = await getServerSession(config)
          if (!sessionUser) {
               return NextResponse.json({ error: "No session" }, { status: 401 })
          }
          
          const { user } = sessionUser
          const result = await postgres.user.findFirst({
               where: {
                    image: user?.image,
               }, 
               select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    username: true,
               }
               })

               return NextResponse.json({ user: result }, { status: 200 })
     } catch (error) {
          console.error(error)
          return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
     }
}