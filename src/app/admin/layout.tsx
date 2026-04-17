import Link from "next/link";
import { 
  ChartBarBig, 
  Users, 
  Heart, 
  Trophy, 
  Settings,
  MoveLeft,
  LayoutDashboard
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Overview", href: "/admin", icon: ChartBarBig },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Charities", href: "/admin/charities", icon: Heart },
    { label: "Monthly Draws", href: "/admin/draws", icon: Trophy },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-zinc-100">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-tighter">
            <span className="text-primary italic">Admin</span>
            <span>Console</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-zinc-800 text-sm font-medium text-zinc-400 hover:text-zinc-100"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-zinc-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-zinc-800 text-sm font-medium text-zinc-400"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back to User View
          </Link>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-10 flex items-center px-8">
            <h2 className="font-semibold text-zinc-300">Management Dashboard</h2>
        </header>
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
