import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function AdminLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-white/5 bg-white/5 opacity-70">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-32 rounded-lg mb-2" />
              <Skeleton className="h-3 w-40 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/5 bg-white/5 opacity-70">
        <CardHeader>
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-4 w-64 rounded-md mt-2" />
        </CardHeader>
        <CardContent>
           <div className="space-y-4 pt-4">
             {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
             ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
