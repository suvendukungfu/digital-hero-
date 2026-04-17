import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * Cron endpoint for automatic monthly draw execution.
 * Configure in vercel.json:
 * { "crons": [{ "path": "/api/cron/monthly-draw", "schedule": "0 0 1 * *" }] }
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Call the draw/run endpoint internally
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/draw/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cronSecret}`,
      },
      body: JSON.stringify({ mode: "random" }),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[CRON_DRAW_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
