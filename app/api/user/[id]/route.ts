import { getSessionUser } from "@/components/get-session-user";
import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionUser();
  const userId = params.id;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await postgres.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    const userId = params.id;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session?.id || userId !== session?.id) {
      return new Response(null, { status: 403 });
    }

    // Get the request body and validate it.
    const body = await req.json();
    const profileSchema = z.object({
      id: z.string(),
      email: z.string().email().nullable().optional(),
      name: z.string().nullable().optional(),
      bio: z.string().max(160).nullable().optional(),
      location: z.string().max(30).nullable().optional(),
    });

    const payload = profileSchema.parse(body);

    await postgres.user.update({
      where: {
        id: session.id,
      },
      data: {
        email: payload.email,
        name: payload.name,
        bio: payload.bio,
        location: payload.location,
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
