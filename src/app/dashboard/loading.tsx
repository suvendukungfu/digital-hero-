import { Skeleton } from "@/components/ui/Skeleton";
import { ShieldCheck, Target, Award, Heart, CreditCard, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function DashboardLoading() {
  return (
    <div className="p-8 lg:p-12 pb-24 space-y-10 max-w-7xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-6 w-72 rounded-md" />
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[Target, Award, Heart, CreditCard].map((Icon, i) => (
          <Card key={i} variant="glass" className="opacity-70">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <Icon className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass" className="opacity-70">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <Skeleton className="h-6 w-40 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-16 h-16 rounded-2xl" />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card variant="glass" className="opacity-70">
             <CardHeader className="flex flex-row items-center justify-between pb-4">
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                 <Skeleton className="h-20 w-full rounded-2xl" />
                 <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card variant="glass" className="opacity-70">
            <CardHeader pb-4>
              <Skeleton className="h-6 w-32 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-2xl" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
