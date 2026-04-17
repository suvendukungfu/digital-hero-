import { createAdminClient } from "@/lib/supabase/server";
import { Award, Check, X, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { revalidatePath } from "next/cache";

async function updatePayoutStatus(winnerId: string, status: string, approved: boolean) {
  'use server';
  const adminClient = (await import("@/lib/supabase/server")).createAdminClient();
  await adminClient.from("winners").update({ payout_status: status, admin_approved: approved }).eq("id", winnerId);
  (await import("next/cache")).revalidatePath("/admin/winners");
}

export default async function AdminWinnersPage() {
  const adminClient = createAdminClient();

  const { data: winners } = await adminClient
    .from("winners")
    .select("*, profiles(full_name, email), draw_periods(winning_numbers, end_date)")
    .order("created_at", { ascending: false });

  const totalPending = winners?.filter(w => w.payout_status === 'pending').length || 0;
  const totalPaid = winners?.reduce((sum, w) => w.payout_status === 'paid' ? sum + w.payout_amount : sum, 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Award className="w-7 h-7 text-amber-500" />
            Winner Management
          </h1>
          <p className="text-zinc-500 text-sm">Review, approve, and manage prize payouts.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="pending">{totalPending} Pending</Badge>
          <Badge variant="paid">${totalPaid.toLocaleString()} Paid</Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-800/30 text-[10px] uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Winner</th>
                <th className="px-6 py-4">Match</th>
                <th className="px-6 py-4">Prize</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Draw Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {winners && winners.length > 0 ? winners.map((winner) => (
                <tr key={winner.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{winner.profiles?.full_name || 'Unknown'}</p>
                      <p className="text-[10px] text-zinc-600 font-mono">{winner.profiles?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-lg font-black",
                      winner.match_count === 5 ? "text-amber-400" :
                      winner.match_count === 4 ? "text-blue-400" : "text-emerald-400"
                    )}>
                      {winner.match_count}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-white">
                    ${winner.payout_amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      winner.payout_status === 'paid' ? 'paid' :
                      winner.payout_status === 'approved' ? 'active' :
                      winner.payout_status === 'rejected' ? 'inactive' : 'pending'
                    }>
                      {winner.payout_status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">
                    {winner.draw_periods?.end_date 
                      ? new Date(winner.draw_periods.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      {winner.payout_status === 'pending' && (
                        <>
                          <form action={async () => {
                            'use server';
                            const ac = (await import("@/lib/supabase/server")).createAdminClient();
                            await ac.from("winners").update({ payout_status: 'approved', admin_approved: true }).eq("id", winner.id);
                            (await import("next/cache")).revalidatePath("/admin/winners");
                          }}>
                            <Button variant="ghost" size="sm" className="text-xs text-emerald-400 hover:bg-emerald-500/10">
                              <Check className="w-3 h-3 mr-1" /> Approve
                            </Button>
                          </form>
                          <form action={async () => {
                            'use server';
                            const ac = (await import("@/lib/supabase/server")).createAdminClient();
                            await ac.from("winners").update({ payout_status: 'rejected', admin_approved: false }).eq("id", winner.id);
                            (await import("next/cache")).revalidatePath("/admin/winners");
                          }}>
                            <Button variant="ghost" size="sm" className="text-xs text-rose-400 hover:bg-rose-500/10">
                              <X className="w-3 h-3 mr-1" /> Reject
                            </Button>
                          </form>
                        </>
                      )}
                      {winner.payout_status === 'approved' && (
                        <form action={async () => {
                          'use server';
                          const ac = (await import("@/lib/supabase/server")).createAdminClient();
                          await ac.from("winners").update({ payout_status: 'paid' }).eq("id", winner.id);
                          (await import("next/cache")).revalidatePath("/admin/winners");
                        }}>
                          <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:bg-blue-500/10">
                            <DollarSign className="w-3 h-3 mr-1" /> Mark Paid
                          </Button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-zinc-600 italic text-sm">
                    No winners recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
