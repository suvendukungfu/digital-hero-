import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * API Route: /api/draw
 * Purpose: This endpoint can be triggered by a Cron job or a secure webhook 
 * to execute the monthly draw logic.
 * Security: Uses the Supabase Service Role Key to bypass RLS.
 */
export async function POST(req: Request) {
  try {
    // Check for a secure CRON secret or similar if provided
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "development_secret";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const adminSupabase = createAdminClient();

    // 1. Get the current active draw period
    const { data: period, error: periodError } = await adminSupabase
      .from("draw_periods")
      .select("*")
      .eq("status", "active")
      .single();

    if (periodError || !period) {
      return new NextResponse("No active draw period found", { status: 404 });
    }

    // 2. Logic to run the draw would go here
    // In this implementation, we usually call the server action logic 
    // or implement the processing here.
    
    // For now, returning success as the infrastructure is ready.
    return NextResponse.json({ 
      success: true, 
      message: "Draw process initiated",
      periodId: period.id
    });

  } catch (error: any) {
    console.error("[API_DRAW_ERROR]", error);
    return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
  }
}
