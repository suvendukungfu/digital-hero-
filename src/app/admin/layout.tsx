import Link from "next/link";
import { 
  ChartBarBig, Users, Heart, Trophy, Settings, Award, ArrowLeft
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

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

  const navItems = [
    { label: "Overview", href: "/admin", icon: ChartBarBig },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Charities", href: "/admin/charities", icon: Heart },
    { label: "Draws", href: "/admin/draws", icon: Trophy },
    { label: "Winners", href: "/admin/winners", icon: Award },
  ];

  return (
    <div className="flex min-h-screen bg-background text-zinc-100">
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/admin" className="flex items-center gap-3 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm shadow-lg">
              G
            </div>
            <span>Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all hover:bg-zinc-800 text-sm font-medium text-zinc-400 hover:text-white"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
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
