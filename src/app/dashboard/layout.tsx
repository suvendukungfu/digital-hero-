import Link from "next/link";
import { 
  LayoutDashboard, 
  Trophy, 
  Heart, 
  Settings, 
  LogOut,
  CircleUser,
  ShieldCheck
} from "lucide-react";
import { signout } from "@/app/auth/action";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user?.id)
    .single();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Scores", href: "/dashboard/scores", icon: Trophy },
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
          <form action={signout}>
            <button className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-destructive/10 text-sm font-bold text-muted-foreground hover:text-destructive">
              <LogOut className="w-5 h-5" />
              Terminate Session
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative z-10 glass-bg">
        <div className="h-full">
            {children}
        </div>
      </main>
    </div>
  );
}
