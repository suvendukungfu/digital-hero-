import { createClient } from "@/lib/supabase/server";
import { runDraw, createPeriod } from "./actions";
import { Trophy, Play, History, Coins, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawPeriod {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  total_pool: number;
  winning_numbers: number[] | null;
  draw_entries?: { count: number }[];
}

export default async function AdminDrawsPage() {
  const supabase = createClient();

  // Get current active period
  const { data: activePeriod } = await supabase
    .from("draw_periods")
    .select("*, draw_entries(count)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single() as { data: DrawPeriod | null };

  // Get past draws
  const { data: pastDraws } = await supabase
    .from("draw_periods")
    .select("*")
    .eq("status", "drawn")
    .order("end_date", { ascending: false }) as { data: DrawPeriod[] | null };

  return (
    <div className="space-y-8 animate-in fade-in transition-all duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Monthly Draws</h1>
        <p className="text-zinc-500">Manage draw periods, simulate outcomes, and publish winning numbers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Period Controller */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy className="w-32 h-32 text-primary" />
            </div>
            
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Active Period
                    </p>
                    <h2 className="text-2xl font-bold">
                        {activePeriod ? `Period: ${new Date(activePeriod.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : "No Active Period"}
                    </h2>
                </div>
                {activePeriod && (
                    <div className="px-4 py-2 bg-zinc-800 rounded-xl border border-zinc-700 font-mono text-sm">
                        POOL: ${activePeriod.total_pool?.toLocaleString() || "0.00"}
                    </div>
                )}
            </div>

            {activePeriod ? (
                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/50">
                        <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Total Entries</p>
                        <p className="text-xl font-bold flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            {activePeriod.draw_entries?.[0]?.count || 0}
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/50">
                        <p className="text-xs text-zinc-500 font-bold uppercase mb-1">End Date</p>
                        <p className="text-xl font-bold flex items-center gap-2 text-white">
                            <Calendar className="w-4 h-4 text-primary" />
                            {new Date(activePeriod.end_date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ) : (
                <form action={async (formData: FormData) => {
                    'use server'
                    const pool = parseFloat(formData.get('pool') as string) || 5000;
                    await createPeriod(pool);
                }} className="space-y-4">
                    <div className="flex gap-4">
                        <input 
                            name="pool" 
                            type="number" 
                            placeholder="Initial Pool Amount ($)" 
                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-white"
                        />
                        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold text-sm">
                            Initialize Period
                        </button>
                    </div>
                </form>
            )}

            {activePeriod && (
                <div className="flex flex-col gap-3 relative z-10 pt-4 border-t border-zinc-800">
                    <p className="text-sm font-medium text-zinc-300">Run Draw Algorithm</p>
                    <div className="grid grid-cols-2 gap-3">
                        <form action={async () => {
                            'use server'
                            await runDraw(activePeriod.id, 'random');
                        }}>
                            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-95 transition-all">
                                <Play className="w-4 h-4" />
                                Pure Random
                            </button>
                        </form>
                        <form action={async () => {
                            'use server'
                            await runDraw(activePeriod.id, 'algorithmic');
                        }}>
                            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 font-bold text-sm text-zinc-300 active:scale-95 transition-all">
                                <Coins className="w-4 h-4" />
                                Weighted Algo
                            </button>
                        </form>
                    </div>
                </div>
            )}
          </div>

          <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30">
            <h3 className="font-bold mb-6 flex items-center gap-2 italic text-white">
                <History className="w-4 h-4" />
                Historical Outcomes
            </h3>
            <div className="space-y-4">
                {pastDraws?.map((draw) => (
                    <div key={draw.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/30 border border-zinc-800/50">
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-white">{new Date(draw.end_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                            <div className="flex gap-1.5 mt-2">
                                {draw.winning_numbers?.map((num: number) => (
                                    <div key={num} className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-primary border border-zinc-700">
                                        {num}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Final Pool</p>
                            <p className="font-mono font-bold text-emerald-500">${draw.total_pool?.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
                {!pastDraws?.length && (
                    <p className="text-center py-8 text-zinc-600 italic text-sm">No draw history available yet.</p>
                )}
            </div>
          </div>
        </div>

        {/* Sidebar Help / Info */}
        <div className="space-y-6">
            <div className="p-6 rounded-3xl border border-zinc-800 bg-gradient-to-br from-primary/10 to-transparent">
                <h4 className="font-bold flex items-center gap-2 mb-2 text-white">
                    Draw Rules
                </h4>
                <div className="space-y-4 text-xs text-zinc-400 leading-relaxed">
                    <p>
                        <strong>Jackpot (5 Matches):</strong> 40% of the total monthly pool is awarded to users who match all 5 numbers.
                    </p>
                    <p>
                        <strong>Match 4:</strong> 35% of the pool is split among qualifying participants.
                    </p>
                    <p>
                        <strong>Match 3:</strong> 25% of the pool is distributed to those matching 3 numbers.
                    </p>
                    <p className="pt-2 border-t border-zinc-800 italic">
                        All prizes are split equally if multiple winners are found per tier.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
