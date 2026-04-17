import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { runFullDraw } from "@/lib/draw-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { periodId, mode = 'random' } = body;

    // Auth: admin or CRON_SECRET
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    let isAuthorized = false;

    if (authHeader === `Bearer ${cronSecret}`) {
      isAuthorized = true;
    } else {
      // Check if request is from an admin user
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const adminClient = createAdminClient();
        const { data: profile } = await adminClient
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile?.role === "admin") isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const adminClient = createAdminClient();

    // 1. Get the draw period
    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      // Get the current active period
      const { data: activePeriod } = await adminClient
        .from("draw_periods")
        .select("*")
        .eq("status", "active")
        .single();

      if (!activePeriod) {
        return NextResponse.json({ error: "No active draw period found" }, { status: 404 });
      }
      targetPeriodId = activePeriod.id;
    }

    const { data: period } = await adminClient
      .from("draw_periods")
      .select("*")
      .eq("id", targetPeriodId)
      .single();

    if (!period || period.status === "drawn") {
      return NextResponse.json({ error: "Invalid or already completed period" }, { status: 400 });
    }

    // 2. Snapshot: Get all active subscribers' scores and create draw entries
    const { data: activeProfiles } = await adminClient
      .from("profiles")
      .select("id")
      .eq("subscription_status", "active");

    if (!activeProfiles || activeProfiles.length === 0) {
      return NextResponse.json({ error: "No active subscribers to enter the draw" }, { status: 400 });
    }

    const entries: { user_id: string; scores: number[] }[] = [];

    for (const profile of activeProfiles) {
      const { data: scores } = await adminClient
        .from("golf_scores")
        .select("score")
        .eq("user_id", profile.id)
        .order("score_date", { ascending: false })
        .limit(5);

      if (scores && scores.length > 0) {
        const scoreValues = scores.map(s => s.score);
        entries.push({ user_id: profile.id, scores: scoreValues });

        // Insert snapshot into draw_entries
        await adminClient.from("draw_entries").upsert({
          draw_period_id: targetPeriodId,
          user_id: profile.id,
          scores: scoreValues,
        }, { onConflict: "draw_period_id,user_id" });
      }
    }

    if (entries.length === 0) {
      return NextResponse.json({ error: "No entries with scores found" }, { status: 400 });
    }

    // 3. Run the draw engine
    const drawResult = runFullDraw(
      mode,
      entries,
      period.total_pool || 0,
      period.jackpot_rollover || 0
    );

    // 4. Persist results
    // Update the period
    await adminClient.from("draw_periods").update({
      winning_numbers: drawResult.winningNumbers,
      status: "drawn",
    }).eq("id", targetPeriodId);

    // Insert winners
    if (drawResult.winners.length > 0) {
      await adminClient.from("winners").insert(
        drawResult.winners.map(w => ({
          draw_period_id: targetPeriodId,
          user_id: w.user_id,
          match_count: w.match_count,
          payout_amount: w.payout_amount,
          payout_status: "pending",
        }))
      );
    }

    // 5. Create next period with any jackpot rollover
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await adminClient.from("draw_periods").insert({
      start_date: new Date().toISOString(),
      end_date: nextMonth.toISOString(),
      status: "active",
      total_pool: 0,
      jackpot_rollover: drawResult.jackpotRollover,
    });

    return NextResponse.json({
      success: true,
      winningNumbers: drawResult.winningNumbers,
      totalEntries: entries.length,
      totalWinners: drawResult.winners.length,
      jackpotRollover: drawResult.jackpotRollover,
    });
  } catch (error: any) {
    console.error("[DRAW_RUN_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
