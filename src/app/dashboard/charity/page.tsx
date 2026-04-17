import { createClient } from "@/lib/supabase/server";
import { selectCharity } from "./actions";
import { Heart, CircleCheckBig, Info, Building2, Sparkles, Target, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function CharityPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: charities } = await supabase
    .from("charities")
    .select("*")
    .order("name");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("selected_charity_id, charity_percentage")
    .eq("user_id", user?.id)
    .single();

  return (
    <div className="p-8 lg:p-12 pb-24 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            Impact Gallery
            <Heart className="w-6 h-6 text-rose-500" />
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose a global cause to support with your monthly subscription.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charities?.map((charity) => {
          const isSelected = subscription?.selected_charity_id === charity.id;
          
          return (
            <Card 
              key={charity.id}
              variant="glass"
              className={cn(
                "group relative transition-all duration-500",
                isSelected && "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
              )}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-primary z-10">
                  <div className="bg-primary p-1.5 rounded-full shadow-lg shadow-primary/20">
                    <CircleCheckBig className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              )}

              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <Building2 className="w-7 h-7 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{charity.name}</CardTitle>
                  <CardDescription className="line-clamp-3 mt-2">
                    {charity.description || "Empowering communities through sustainable initiatives and direct social impact programs globally."}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="mt-auto space-y-6">
                <form action={async (formData: FormData) => {
                  'use server'
                  const percentage = parseInt(formData.get('percentage') as string);
                  await selectCharity(charity.id, percentage);
                }} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Contribution</p>
                        <p className="text-2xl font-black text-white">{isSelected ? (subscription?.charity_percentage || 10) : 10}%</p>
                      </div>
                    </div>
                    
                    <input 
                      type="range"
                      name="percentage"
                      min="10"
                      max="100"
                      step="5"
                      defaultValue={isSelected ? (subscription?.charity_percentage || 10) : 10}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                  </div>

                  <Button 
                    type="submit"
                    variant={isSelected ? "glass" : "primary"}
                    className={cn(
                      "w-full group",
                      isSelected && "pointer-events-none opacity-50"
                    )}
                  >
                    {isSelected ? "Currently Protecting" : "Support this Cause"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
