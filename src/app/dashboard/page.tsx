import { createClient } from "@/lib/supabase/server";
import { 
  Trophy, Target, Heart, TrendingUp, Clock, ArrowRight, 
  Activity, Calendar, Sparkles, Ticket, Award, CreditCard, ShieldCheck, Lock
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SubscribeButton } from "@/components/SubscribeButton";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*, charities(name)")
    .eq("user_id", user?.id)
    .single();

  const { data: scores } = await supabase
    .from("golf_scores")
    .select("*")
    .eq("user_id", user?.id)
    .order("score_date", { ascending: false })
    .limit(5);

  const { data: activePeriod } = await supabase
    .from("draw_periods")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: winnings } = await supabase
    .from("winners")
    .select("payout_amount, payout_status")
    .eq("user_id", user?.id);

  const totalWinnings = winnings?.reduce((sum, w) => sum + (w.payout_amount || 0), 0) || 0;
  const scoreValues = scores?.map(s => s.score) || [];

  return (
    <div className="p-8 lg:p-12 pb-24 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
            Hero Console
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, <span className="text-white font-semibold">{profile?.full_name?.split(' ')[0] || 'Hero'}</span>. Your impact is growing.
          </p>
        </div>
        <Badge variant={profile?.subscription_status === 'active' ? 'active' : 'inactive'} className="text-xs px-4 py-1.5">
          {profile?.subscription_plan === 'yearly' ? 'Annual Elite' : 'Monthly Elite'}
        </Badge>
      </div>

      {/* ─── Subscription Required Banner ───────────────────────────── */}
      {profile?.subscription_status !== 'active' && profile?.role !== 'admin' && (
        <div className="p-8 rounded-[32px] glass border-amber-500/20 bg-amber-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex items-start gap-5 flex-1">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0 shadow-xl shadow-amber-500/10">
                <ShieldCheck className="w-8 h-8 text-amber-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white tracking-tight">Unlock the Full Hero Console</h2>
                  <Lock className="w-4 h-4 text-amber-500/60" />
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-lg">
                  Subscribe to access score tracking, monthly prize draws, charity matching, and real-time analytics. 
                  Your journey of impact starts with one click.
                </p>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <SubscribeButton plan="monthly" variant="secondary" size="default" />
              <SubscribeButton plan="yearly" variant="primary" size="default" />
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass" className="glass-hover">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Scores</span>
            </div>
            <p className="text-3xl font-black text-white">{scores?.length || 0}<span className="text-lg text-muted-foreground">/5</span></p>
            <p className="text-xs text-muted-foreground font-medium">Active draw entries</p>
          </CardContent>
        </Card>

        <Card variant="glass" className="glass-hover">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Winnings</span>
            </div>
            <p className="text-3xl font-black text-white">${totalWinnings.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground font-medium">Total prize earnings</p>
          </CardContent>
        </Card>

        <Card variant="glass" className="glass-hover">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Heart className="w-5 h-5 text-rose-500" />
              </div>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Charity</span>
            </div>
            <p className="text-3xl font-black text-white">{subscription?.charity_percentage || 0}%</p>
            <p className="text-xs text-muted-foreground font-medium truncate">{(subscription as any)?.charities?.name || 'Not selected'}</p>
          </CardContent>
        </Card>

        <Card variant="glass" className="glass-hover">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <CreditCard className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Plan</span>
            </div>
            <p className="text-3xl font-black text-white capitalize">{profile?.subscription_plan || 'None'}</p>
            <p className="text-xs text-muted-foreground font-medium">
              {subscription?.current_period_end 
                ? `Renews ${new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : 'No renewal date'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Active Numbers
              </CardTitle>
              <Link href="/dashboard/scores" className="text-xs font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1">
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {scoreValues.length > 0 ? (
                <div className="flex gap-4 flex-wrap">
                  {scoreValues.map((score, i) => (
                    <div key={i} className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black border shadow-lg",
                      i === 0 
                        ? "bg-primary/10 border-primary/30 text-primary shadow-primary/10" 
                        : "bg-white/5 border-white/10 text-white"
                    )}>
                      {score}
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 5 - scoreValues.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-16 h-16 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-muted-foreground/30 text-2xl">
                      ?
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Target className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No scores yet. <Link href="/dashboard/scores" className="text-primary font-bold hover:underline">Add your first score</Link></p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Draw Period */}
          <Card variant="glass" className={activePeriod ? "border-amber-500/20 bg-amber-500/5" : ""}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-500" />
                Current Draw
              </CardTitle>
              <Link href="/dashboard/draws" className="text-xs font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {activePeriod ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pool</p>
                    <p className="text-2xl font-black text-white mt-1">
                      ${((activePeriod.total_pool || 0) + (activePeriod.jackpot_rollover || 0)).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ends</p>
                    <p className="text-2xl font-black text-white mt-1">
                      {new Date(activePeriod.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4">No active draw period.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Log New Score", href: "/dashboard/scores", icon: Target, color: "text-blue-500" },
                { label: "View Draws", href: "/dashboard/draws", icon: Ticket, color: "text-amber-500" },
                { label: "Choose Charity", href: "/dashboard/charity", icon: Heart, color: "text-rose-500" },
                { label: "Settings", href: "/dashboard/settings", icon: Activity, color: "text-emerald-500" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                >
                  <div className="p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                    <action.icon className={cn("w-4 h-4", action.color)} />
                  </div>
                  <span className="text-sm font-bold text-white">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
