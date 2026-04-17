import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  CreditCard, 
  Heart, 
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Winner {
  id: string;
  payout_amount: number;
  payout_status: string;
  draw_period_id: string;
  profiles: {
    full_name: string;
  } | null;
}

export default async function AdminDashboard() {
  const supabase = createClient();

  // Aggregate Data
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: activeSubs } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active');
  const { data: recentWinners } = await supabase.from('winners').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(5) as { data: Winner[] | null };

  const stats = [
    {
      label: "Total Platform Users",
      value: totalUsers || 0,
      trend: "+12.5%",
      positive: true,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Active Subscriptions",
      value: activeSubs || 0,
      trend: "+4.2%",
      positive: true,
      icon: CreditCard,
      color: "text-emerald-500",
    },
    {
      label: "Current Draw Pool",
      value: "$12,450.00",
      trend: "+$2.1k",
      positive: true,
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      label: "Charity Donations",
      value: "$4,820.00",
      trend: "-1.2%",
      positive: false,
      icon: Heart,
      color: "text-rose-500",
    },
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

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-zinc-800/50">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full",
                stat.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              )}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-white">
              <Activity className="w-4 h-4 text-primary" />
              Recent Winners
            </h3>
            <button className="text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-800/30 text-[10px] uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Prize</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {recentWinners?.length ? recentWinners.map((winner) => (
                  <tr key={winner.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors text-white">{winner.profiles?.full_name || 'Unknown User'}</p>
                      <p className="text-[10px] text-zinc-600 font-mono uppercase">{winner.draw_period_id.slice(0, 8)}</p>
                    </td>
                    <td className="px-6 py-4 text-xs">
                        <span className={cn(
                            "px-2 py-0.5 rounded-full border",
                            winner.payout_status === 'paid' ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500" : "border-amber-500/20 bg-amber-500/5 text-amber-500"
                        )}>
                            {winner.payout_status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right text-zinc-100">
                        ${winner.payout_amount.toLocaleString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-zinc-600 italic text-sm">
                      No winning activity recorded in the system yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Logs */}
        <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-800/50 to-transparent">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-white">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Admin Quick Actions
                </h3>
                <div className="grid gap-2">
                    <Link href="/admin/draws" className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-medium flex items-center justify-between text-zinc-300">
                        Run New Draw Period
                        <ArrowUpRight className="w-4 h-4 text-zinc-500" />
                    </Link>
                    <Link href="/admin/charities" className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-medium flex items-center justify-between text-zinc-300">
                        Manage Charities
                        <ArrowUpRight className="w-4 h-4 text-zinc-500" />
                    </Link>
                    <button className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-medium flex items-center justify-between text-zinc-300">
                        Export Payout Report
                        <ArrowUpRight className="w-4 h-4 text-zinc-500" />
                    </button>
                </div>
            </div>
            
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30">
                <h3 className="font-bold text-sm mb-4 text-white">Platform Growth</h3>
                <div className="h-24 flex items-end gap-1 px-2">
                    {[40, 60, 45, 75, 55, 90, 80, 65, 95].map((h, i) => (
                        <div 
                            key={i} 
                            className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm" 
                            style={{ height: `${h}%` }} 
                        />
                    ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-2">
                    <span>JAN</span>
                    <span>JUN</span>
                    <span>SEP</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
