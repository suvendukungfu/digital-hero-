import { createAdminClient } from "@/lib/supabase/server";
import { 
  Users, CreditCard, Heart, TrendingUp, Activity,
  ArrowUpRight, ArrowDownRight, Trophy, Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminDashboard() {
  const adminClient = createAdminClient();

  // Real aggregated data
  const { count: totalUsers } = await adminClient.from('profiles').select('*', { count: 'exact', head: true });
  const { count: activeSubs } = await adminClient.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active');
  const { data: activePeriod } = await adminClient.from('draw_periods').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(1).single();
  const { count: totalCharities } = await adminClient.from('charities').select('*', { count: 'exact', head: true });
  const { data: recentWinners } = await adminClient
    .from('winners')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(5);

  const currentPool = (activePeriod?.total_pool || 0) + (activePeriod?.jackpot_rollover || 0);

  const stats = [
    { label: "Total Users", value: totalUsers || 0, icon: Users, color: "text-blue-500" },
    { label: "Active Subscriptions", value: activeSubs || 0, icon: CreditCard, color: "text-emerald-500" },
    { label: "Current Draw Pool", value: `$${currentPool.toLocaleString()}`, icon: TrendingUp, color: "text-purple-500" },
    { label: "Charities", value: totalCharities || 0, icon: Heart, color: "text-rose-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">System Overview</h1>
          <p className="text-zinc-500 text-sm">Real-time analytics and platform performance metrics.</p>
        </div>
        <div className="flex gap-2 text-xs font-mono bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEM LIVE
            </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-4">
            <div className="p-2.5 rounded-xl bg-zinc-800/50 w-fit">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Winners */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-white">
              <Activity className="w-4 h-4 text-primary" />
              Recent Winners
            </h3>
            <Link href="/admin/winners" className="text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-800/30 text-[10px] uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Match</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Prize</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {recentWinners?.length ? recentWinners.map((winner) => (
                  <tr key={winner.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">{winner.profiles?.full_name || 'Unknown'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">{winner.match_count}/5</td>
                    <td className="px-6 py-4 text-xs">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full border",
                        winner.payout_status === 'paid' ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500" : "border-amber-500/20 bg-amber-500/5 text-amber-500"
                      )}>
                        {winner.payout_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right">${winner.payout_amount.toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-600 italic text-sm">
                      No winning activity recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-800/50 to-transparent">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-white">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Admin Quick Actions
            </h3>
            <div className="grid gap-2">
              {[
                { label: "Manage Users", href: "/admin/users" },
                { label: "Run New Draw", href: "/admin/draws" },
                { label: "Manage Charities", href: "/admin/charities" },
                { label: "Review Winners", href: "/admin/winners" },
              ].map((action) => (
                <Link key={action.href} href={action.href} className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-medium flex items-center justify-between text-zinc-300">
                  {action.label}
                  <ArrowUpRight className="w-4 h-4 text-zinc-500" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
