import Link from "next/link";
import { 
  LayoutDashboard, 
  Trophy, 
  Heart, 
  Settings, 
  LogOut,
  ShieldCheck,
  Ticket
} from "lucide-react";
import { signout } from "@/app/auth/action";
import { createClient } from "@/lib/supabase/server";
import { SubscribeButton } from "@/components/SubscribeButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, subscription_status")
    .eq("id", user?.id)
    .single();

  const isSubscribed = profile?.subscription_status === 'active';

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Scores", href: "/dashboard/scores", icon: Trophy },
    { label: "Draws", href: "/dashboard/draws", icon: Ticket },
    { label: "Charity", href: "/dashboard/charity", icon: Heart },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden text-zinc-100">
      <aside className="w-72 glass border-r border-white/5 hidden md:flex flex-col relative z-20">
        <div className="p-8 pb-12 text-white">
          <Link href="/" className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-white/5">
                G
            </div>
            <span>GiveBack</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-white/5 text-sm font-semibold text-muted-foreground hover:text-white"
            >
              <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
              {item.label}
            </Link>
          ))}
          
          {profile?.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-primary/10 text-sm font-semibold text-primary"
            >
              <ShieldCheck className="w-5 h-5" />
              Admin Portal
            </Link>
          )}
        </nav>

        <div className="p-6 mt-auto">
          {!isSubscribed && (
            <div className="mb-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Elite Access</p>
              <p className="text-xs font-bold leading-tight">Unlock full console analytics and draws.</p>
              <SubscribeButton plan="monthly" variant="primary" size="sm" className="w-full text-[10px]" />
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
        {!isSubscribed ? (
            <div className="h-full min-h-screen flex items-center justify-center p-12 bg-black/40 backdrop-blur-2xl">
              <div className="max-w-md w-full glass p-10 rounded-[40px] border-white/10 text-center space-y-8 shadow-2xl">
                <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto border border-primary/30 shadow-2xl shadow-primary/20">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-black tracking-tighter text-white">Restricted Access</h1>
                  <p className="text-muted-foreground font-medium text-sm">
                    The premium Hero Console requires an active subscription to track accuracy and support global causes.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <SubscribeButton plan="monthly" variant="secondary" />
                    <SubscribeButton plan="yearly" variant="primary" />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Secure Checkout via Stripe</p>
              </div>
            </div>
        ) : (
            <div className="h-full">
                {children}
            </div>
        )}
      </main>
    </div>
  );
}
