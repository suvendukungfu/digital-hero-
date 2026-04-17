import { createClient } from "@/lib/supabase/server";
import { upsertCharity, deleteCharity } from "./actions";
import { Heart, Plus, Trash2, Edit2, Building2 } from "lucide-react";

interface Charity {
  id: string;
  name: string;
  description: string;
}

export default async function AdminCharitiesPage() {
  const supabase = createClient();
  const { data: charities } = await supabase
    .from("charities")
    .select("*")
    .order("name") as { data: Charity[] | null };

  return (
    <div className="space-y-8 animate-in fade-in transition-all duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Charity Management</h1>
          <p className="text-zinc-500">Add, edit, or remove charities from the platform database.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Charity Form */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl space-y-6 sticky top-24">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add Charity
            </h2>
            <form action={upsertCharity} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Name</label>
                    <input 
                        name="name" 
                        required 
                        placeholder="e.g. Ocean Cleanup Foundation" 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Description</label>
                    <textarea 
                        name="description" 
                        rows={4}
                        placeholder="Describe the charity's mission and impact..." 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    />
                </div>
                <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all">
                    Register Charity
                </button>
            </form>
          </div>
        </div>

        {/* Charity List */}
        <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-400 pl-2">
                <Building2 className="w-4 h-4" />
                Registered Charities ({charities?.length || 0})
            </h2>
            <div className="space-y-3">
                {charities?.map((charity: Charity) => (
                    <div key={charity.id} className="p-5 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex items-center justify-between group transition-all hover:bg-zinc-800/10 hover:border-zinc-700">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                <Heart className="w-6 h-6 text-rose-500" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg">{charity.name}</h3>
                                <p className="text-xs text-zinc-500 line-clamp-1 max-w-md">{charity.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <form action={async () => {
                                'use server'
                                await deleteCharity(charity.id);
                            }}>
                                <button className="p-2.5 rounded-xl bg-zinc-800 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
