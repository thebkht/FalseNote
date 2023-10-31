import { config } from "@/app/auth";
import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
     try {
          const { user } = await req.json();
          

          const result = await postgres.user.findFirst({
               where: {
                    image: user?.image,
               }
               })

               return NextResponse.json({ user: JSON.parse(JSON.stringify(result)) }, { status: 200 })
     } catch (error) {
          console.error(error)
          return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
     }
}