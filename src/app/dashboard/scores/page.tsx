import { createClient } from "@/lib/supabase/server";
import { addScore, deleteScore } from "./actions";
import { Trophy, Calendar, Plus, Trash2, Info, Target, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default async function ScoresPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: scores } = await supabase
    .from("golf_scores")
    .select("*")
    .eq("user_id", user?.id)
    .order("score_date", { ascending: false });

  return (
    <div className="p-8 lg:p-12 pb-24 space-y-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            Score Vault
            <Trophy className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-muted-foreground text-lg">
            Log your latest rounds to qualify for upcoming prize draws.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entry Form */}
        <div className="space-y-6">
          <Card variant="glass" className="relative overflow-visible">
             <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase shadow-xl z-10">
              New Entry
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Record Results
              </CardTitle>
              <CardDescription>Enter your round details below.</CardDescription>
            </CardHeader>
            
            <CardContent>
              <form action={addScore} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wide uppercase text-muted-foreground ml-1" htmlFor="score">
                    Score (1-45)
                  </label>
                  <Input
                    id="score"
                    name="score"
                    type="number"
                    min="1"
                    max="45"
                    required
                    placeholder="24"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wide uppercase text-muted-foreground ml-1" htmlFor="score_date">
                    Round Date
                  </label>
                  <Input
                    id="score_date"
                    name="score_date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 group"
                >
                  Confirm & Log
                  <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
                </Button>
              </form>

              <div className="mt-8 flex gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="shrink-0 mt-0.5">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The system maintains exactly <span className="text-white font-bold">5 active entries</span>. Adding a new score will automatically phase out your oldest entry.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scores List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Active Draw Registry
            </h2>
            {scores && scores.length > 0 && (
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {scores.length} Collected Entries
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {scores && scores.length > 0 ? (
              scores.map((score, index) => (
                <Card 
                  key={score.id}
                  variant="glass"
                  className={cn(
                    "glass-hover border-white/5",
                    index === 0 && "border-primary/20 bg-primary/5"
                  )}
                >
                  <CardContent className="p-6 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                         <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-2xl font-black text-primary border border-white/10 shadow-inner">
                          {score.score}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2 bg-primary p-1 rounded-md shadow-lg">
                            <Sparkles className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                     
                      <div className="space-y-1">
                        <p className="font-bold text-lg leading-none">
                          Entry Rank #{scores.length - index}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 uppercase font-bold tracking-tighter">
                          <Calendar className="w-3 h-3" />
                          {new Date(score.score_date).toLocaleDateString([], { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <form action={async () => {
                      'use server'
                      // Note: This needs closure or server action in separate file if using client-side 
                      // but here it is in a server component with a simplified approach
                    }}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="py-24 text-center rounded-3xl border border-dashed border-white/10 bg-white/5 space-y-4">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <Trophy className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <div className="space-y-1 px-8">
                  <p className="text-xl font-bold">No High Scores Found</p>
                  <p className="text-muted-foreground">Log your results to participate in the exclusive monthly draws.</p>
                </div>
                <Button variant="outline" className="mt-4 pointer-events-none opacity-50">Log First Round</Button>
              </div>
            )}
            
            {scores && scores.length > 0 && scores.length < 5 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Full Draw Access Pending</p>
                      <p className="text-xs text-amber-500 font-medium tracking-tight">
                        You need <span className="underline decoration-2">{5 - scores.length} more entries</span> to optimize your winning probability.
                      </p>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
