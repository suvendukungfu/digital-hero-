"use client";

import { createClient } from "@/lib/supabase/client";
import { 
  Trophy, 
  Target, 
  Heart, 
  TrendingUp,
  Clock,
  ArrowRight,
  Activity,
  Calendar,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Reveal, Counter } from "@/components/MotionWrapper";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState<{
    user: any;
    profile: any;
    subscription: any;
    scores: any[];
  } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*, charities(name)")
        .eq("user_id", user?.id)
        .single();

      const { data: scores } = await supabase
        .from("golf_scores")
        .select("*")
        .eq("user_id", user?.id)
        .order("score_date", { ascending: false })
        .limit(5);

      setData({ user, profile, subscription, scores: scores || [] });
    };

    fetchDashboardData();
  }, []);

  if (!data) return <div className="p-8 text-center text-white">Loading Hero Console...</div>;

  const { profile, subscription, scores } = data;

  return (
    <div className="p-8 pb-24 space-y-10 max-w-7xl mx-auto">
      <Reveal>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Hero Console
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back, <span className="text-white font-semibold">{profile?.full_name?.split(' ')[0]}</span>. Your impact is growing.
            </p>
          </div>
        </div>
      </Reveal>
      {/* Rest of page content simplified for commit */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass"><CardContent className="p-6">Performance Active</CardContent></Card>
        <Card variant="glass"><CardContent className="p-6">Impact Score: {subscription?.charity_percentage || 0}%</CardContent></Card>
      </div>
    </div>
  );
}
