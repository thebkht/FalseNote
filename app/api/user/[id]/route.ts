import { getSessionUser } from "@/components/get-session-user";
import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse, { params }: { params: { id: string }}) {
     const session = await getSessionUser()
     const userId = params.id;
     if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }

     const user = await postgres.user.findUnique({
          where: {
               id: Number(userId),
          },
     });
     if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
     }

     return NextResponse.json(user, { status: 200});
}