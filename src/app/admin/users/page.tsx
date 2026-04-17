import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Users, Search, ShieldCheck, ShieldOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { revalidatePath } from "next/cache";

async function toggleRole(userId: string, newRole: string) {
  'use server';
  const adminClient = (await import("@/lib/supabase/server")).createAdminClient();
  await adminClient.from("profiles").update({ role: newRole }).eq("id", userId);
  revalidatePath("/admin/users");
}

export default async function AdminUsersPage() {
  const adminClient = createAdminClient();

  const { data: users } = await adminClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-500" />
            User Management
          </h1>
          <p className="text-zinc-500 text-sm">View and manage all platform users and their roles.</p>
        </div>
        <Badge variant="default" className="text-xs">{users?.length || 0} Total Users</Badge>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-800/30 text-[10px] uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Subscription</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{user.full_name || 'Unnamed'}</p>
                      <p className="text-[10px] text-zinc-600 font-mono">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'admin' ? 'admin' : 'default'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.subscription_status === 'active' ? 'active' : 'inactive'}>
                      {user.subscription_status || 'inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400 capitalize">
                    {user.subscription_plan || 'none'}
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">
                    {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={async () => {
                      'use server';
                      const newRole = user.role === 'admin' ? 'user' : 'admin';
                      const adminClient = (await import("@/lib/supabase/server")).createAdminClient();
                      await adminClient.from("profiles").update({ role: newRole }).eq("id", user.id);
                      (await import("next/cache")).revalidatePath("/admin/users");
                    }}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        {user.role === 'admin' ? (
                          <><ShieldOff className="w-3 h-3 mr-1" /> Demote</>
                        ) : (
                          <><ShieldCheck className="w-3 h-3 mr-1" /> Promote</>
                        )}
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
