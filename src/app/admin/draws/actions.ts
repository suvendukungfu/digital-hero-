'use server'

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { runFullDraw } from "@/lib/draw-engine"

export async function runDraw(periodId: string, mode: 'random' | 'algorithmic') {
  const userClient = createClient()
  const adminClient = createAdminClient()
  const { data: { user } } = await userClient.auth.getUser()

  // Admin guard check
  const { data: profile } = await userClient.from('profiles').select('role').eq('id', user?.id).single()
  if (profile?.role !== 'admin') throw new Error("Unauthorized")

  // 1. Get Draw Period
  const { data: period } = await adminClient.from('draw_periods').select('*').eq('id', periodId).single()
  if (!period || period.status === 'drawn') throw new Error("Invalid or completed period")

  // 2. Snapshot all active subscribers' scores into draw_entries
  const { data: activeProfiles } = await adminClient
    .from("profiles")
    .select("id")
    .eq("subscription_status", "active")

  if (!activeProfiles || activeProfiles.length === 0) throw new Error("No active subscribers found")

  const entries: { user_id: string; scores: number[] }[] = []

  for (const prof of activeProfiles) {
    const { data: scores } = await adminClient
      .from("golf_scores")
      .select("score")
      .eq("user_id", prof.id)
      .order("score_date", { ascending: false })
      .limit(5)

    if (scores && scores.length > 0) {
      const scoreValues = scores.map(s => s.score)
      entries.push({ user_id: prof.id, scores: scoreValues })

      // Snapshot into draw_entries
      await adminClient.from("draw_entries").upsert({
        draw_period_id: periodId,
        user_id: prof.id,
        scores: scoreValues,
      }, { onConflict: "draw_period_id,user_id" })
    }
  }

  if (entries.length === 0) throw new Error("No entries with scores found")

  // 3. Run the draw engine
  const drawResult = runFullDraw(
    mode,
    entries,
    period.total_pool || 0,
    period.jackpot_rollover || 0
  )

  // 4. Persist results
  await adminClient.from('draw_periods').update({
    winning_numbers: drawResult.winningNumbers,
    status: 'drawn'
  }).eq('id', periodId)

  // Insert winners
  if (drawResult.winners.length > 0) {
    await adminClient.from('winners').insert(drawResult.winners.map(w => ({
      draw_period_id: periodId,
      user_id: w.user_id,
      match_count: w.match_count,
      payout_amount: w.payout_amount,
      payout_status: 'pending'
    })))
  }

  // 5. Create next period with jackpot rollover
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  await adminClient.from('draw_periods').insert({
    start_date: new Date().toISOString(),
    end_date: nextMonth.toISOString(),
    status: 'active',
    total_pool: 0,
    jackpot_rollover: drawResult.jackpotRollover
  })

  revalidatePath('/admin')
  revalidatePath('/admin/draws')
  revalidatePath('/admin/winners')
  revalidatePath('/dashboard/draws')
  return { winningNumbers: drawResult.winningNumbers, winnerCount: drawResult.winners.length }
}

export async function createPeriod(totalPool: number) {
    const adminClient = createAdminClient()
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    
    await adminClient.from('draw_periods').insert({
        start_date: new Date().toISOString(),
        end_date: nextMonth.toISOString(),
        status: 'active',
        total_pool: totalPool,
        jackpot_rollover: 0
    })
    
    revalidatePath('/admin/draws')
}
