import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { 
  LayoutDashboard, 
  Trophy, 
  Heart, 
  Settings, 
  LogOut,
  ShieldCheck,
  Ticket,
  Lock,
  ArrowRight
} from "lucide-react";
import { signout } from "@/app/auth/action";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, subscription_status, subscription_plan")
    .eq("id", user?.id)
    .single();

  const isSubscribed = profile?.subscription_status === 'active';
  const isAdmin = profile?.role === 'admin';
  
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard, requiresSub: false, exact: true },
    { label: "My Scores", href: "/dashboard/scores", icon: Trophy, requiresSub: true, exact: false },
    { label: "Draws", href: "/dashboard/draws", icon: Ticket, requiresSub: true, exact: false },
    { label: "Charity", href: "/dashboard/charity", icon: Heart, requiresSub: true, exact: false },
    { label: "Settings", href: "/dashboard/settings", icon: Settings, requiresSub: false, exact: false },
  ];

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden text-zinc-100">
      <aside className="w-72 border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl hidden md:flex flex-col relative z-20">
        <div className="p-8 pb-12 text-white">
          <Link href="/" className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-[inset_0_1px_rgba(255,255,255,0.4),0_0_20px_rgba(var(--primary),0.2)]">
                G
            </div>
            <span>GiveBack</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const locked = item.requiresSub && !isSubscribed && !isAdmin;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={locked ? "/pricing?reason=subscription_required" : item.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-semibold relative overflow-hidden",
                  locked 
                    ? "text-muted-foreground/40 hover:bg-white/[0.02] cursor-not-allowed"
                    : isActive
                      ? "text-white bg-white/10 shadow-[inset_0_1px_rgba(255,255,255,0.1)] border border-white/10"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-colors relative z-10",
                  locked ? "text-muted-foreground/30" : isActive ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "group-hover:text-primary"
                )} />
                <span className="relative z-10">{item.label}</span>
                {locked && (
                  <Lock className="w-3 h-3 ml-auto text-muted-foreground/30 relative z-10" />
                )}
              </Link>
            );
          })}
          
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-white/5">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-primary/10 text-sm font-semibold text-primary"
              >
                <ShieldCheck className="w-5 h-5 drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                Admin Portal
              </Link>
            </div>
          )}
        </nav>

        <div className="p-6 mt-auto">
          {/* Subscription Status Indicator */}
          {!isSubscribed && !isAdmin && (
            <Link 
              href="/pricing?reason=subscription_required"
              className="block mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3 hover:bg-amber-500/15 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Inactive Subscription</p>
              </div>
              <p className="text-xs font-bold leading-tight text-white/80">Subscribe to unlock full console access.</p>
              <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 uppercase tracking-widest group-hover:gap-2 transition-all">
                View Plans <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          )}

          {isSubscribed && (
            <div className="mb-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Elite Active</p>
              </div>
              <p className="text-xs font-bold text-white/60 capitalize">{profile?.subscription_plan || 'monthly'} plan</p>
            </div>
          )}
          
          <form action={signout}>
            <button className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-destructive/10 text-sm font-bold text-muted-foreground hover:text-destructive">
              <LogOut className="w-5 h-5" />
              Terminate Session
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
