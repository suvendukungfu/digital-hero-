import { createClient } from "@/lib/supabase/server";
import { Trophy, Calendar, Hash, Sparkles, Clock, Award, CircleCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function DrawsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get current active period
  const { data: activePeriod } = await supabase
    .from("draw_periods")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Get past completed draws
  const { data: pastDraws } = await supabase
    .from("draw_periods")
    .select("*")
    .eq("status", "drawn")
    .order("created_at", { ascending: false })
    .limit(6);

  // Get user's current scores (their draw entries)
  const { data: userScores } = await supabase
    .from("golf_scores")
    .select("score")
    .eq("user_id", user?.id)
    .order("score_date", { ascending: false })
    .limit(5);

  // Get user's winnings
  const { data: winnings } = await supabase
    .from("winners")
    .select("*, draw_periods(winning_numbers, end_date)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const userNumbers = userScores?.map(s => s.score) || [];

  return (
    <div className="p-8 lg:p-12 pb-24 space-y-10 max-w-7xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
          Draw Arena
          <Trophy className="w-7 h-7 text-amber-500" />
        </h1>
        <p className="text-muted-foreground text-lg">
          Your scores are your tickets. Match the winning numbers to claim your share.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Period */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass" className="border-primary/20 bg-primary/5 relative overflow-visible">
            <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black tracking-widest uppercase shadow-xl z-10">
              Active Period
            </div>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Current Draw
              </CardTitle>
              <CardDescription>
                {activePeriod ? (
                  <>Ends {new Date(activePeriod.end_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</>
                ) : "No active draw period"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {activePeriod && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Prize Pool</p>
                      <p className="text-3xl font-black text-white mt-1">
                        ${((activePeriod.total_pool || 0) + (activePeriod.jackpot_rollover || 0)).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Jackpot Rollover</p>
                      <p className="text-3xl font-black text-amber-400 mt-1">
                        ${(activePeriod.jackpot_rollover || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* User's Numbers */}
                  <div>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Your Active Numbers</p>
                    <div className="flex gap-3">
                      {userNumbers.length > 0 ? userNumbers.map((num, i) => (
                        <div key={i} className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-black text-primary shadow-lg shadow-primary/5">
                          {num}
                        </div>
                      )) : (
                        <p className="text-sm text-muted-foreground italic">No scores yet. Add scores to enter the draw.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Past Draws */}
          <div className="space-y-4">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Past Results
            </h2>
            {pastDraws && pastDraws.length > 0 ? pastDraws.map(draw => (
              <Card key={draw.id} variant="glass" className="border-white/5">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                      {new Date(draw.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </p>
                    <div className="flex gap-2">
                      {(draw.winning_numbers || []).map((num: number, i: number) => (
                        <div
                          key={i}
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border",
                            userNumbers.includes(num)
                              ? "bg-primary/20 border-primary/40 text-primary"
                              : "bg-white/5 border-white/10 text-muted-foreground"
                          )}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pool</p>
                    <p className="text-lg font-black text-white">${(draw.total_pool || 0).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="py-16 text-center rounded-3xl border border-dashed border-white/10 bg-white/5">
                <Trophy className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">No completed draws yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Winnings Sidebar */}
        <div className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Your Winnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {winnings && winnings.length > 0 ? winnings.map(win => (
                <div key={win.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black text-white">${win.payout_amount.toLocaleString()}</p>
                    <Badge variant={win.payout_status === 'paid' ? 'paid' : win.payout_status === 'approved' ? 'active' : 'pending'}>
                      {win.payout_status}
                    </Badge>
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    {win.match_count} Numbers Matched
                  </p>
                </div>
              )) : (
                <div className="py-12 text-center space-y-2">
                  <Sparkles className="w-10 h-10 text-muted-foreground/20 mx-auto" />
                  <p className="text-sm text-muted-foreground">No winnings yet. Keep playing!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-lg">How Draws Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              {[
                { match: "5 Numbers", prize: "40% — Jackpot", color: "text-amber-400" },
                { match: "4 Numbers", prize: "35% — Tier 2", color: "text-blue-400" },
                { match: "3 Numbers", prize: "25% — Tier 3", color: "text-emerald-400" },
              ].map((tier, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-bold text-white">{tier.match}</span>
                  <span className={cn("font-black", tier.color)}>{tier.prize}</span>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground/60 pt-2 leading-relaxed">
                Unclaimed jackpots roll over to the next period. Multiple winners split the prize equally.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
