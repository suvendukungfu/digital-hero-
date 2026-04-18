import Link from "next/link";
import { 
  ChartBarBig, Users, Heart, Trophy, Settings, Award, ArrowLeft
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { cn } from "@/lib/utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black">Access Denied</h1>
          <p className="text-muted-foreground">You do not have admin privileges.</p>
          <Link href="/dashboard" className="text-primary hover:underline font-bold">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";

  const navItems = [
    { label: "Overview", href: "/admin", icon: ChartBarBig, exact: true },
    { label: "Users", href: "/admin/users", icon: Users, exact: false },
    { label: "Charities", href: "/admin/charities", icon: Heart, exact: false },
    { label: "Draws", href: "/admin/draws", icon: Trophy, exact: false },
    { label: "Winners", href: "/admin/winners", icon: Award, exact: false },
  ];

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden text-zinc-100">
      <aside className="w-72 border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl hidden md:flex flex-col relative z-20">
        <div className="p-8 pb-12 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-[inset_0_1px_rgba(255,255,255,0.4),0_0_20px_rgba(99,102,241,0.2)]">
              A
            </div>
            <span>Admin Console</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-semibold relative overflow-hidden",
                  isActive
                    ? "text-white bg-indigo-500/10 shadow-[inset_0_1px_rgba(255,255,255,0.1)] border border-indigo-500/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-50" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-colors relative z-10",
                  isActive ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "group-hover:text-indigo-400"
                )} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
