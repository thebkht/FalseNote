import { getSessionUser } from "@/components/get-session-user";
import postgres from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    const userId = params.id
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session?.id || userId !== session?.id) {
      return new Response(null, { status: 403 });
    }

    // Get the request body and validate it.
    const body = await req.json();
    const appearanceSchema = z.object({
      id: z.string(),
      theme: z.enum(["light", "dark"], {
        required_error: "Please select a theme.",
      }),
      option: z.enum(["custom", "system"], {
        required_error: "Please select an option.",
      }),
    })

    const payload = appearanceSchema.parse(body);

    await postgres.userSettings.update({
      where: { userId },
      data: {
        appearance: payload.option === "system" ? "system" : payload.theme,
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