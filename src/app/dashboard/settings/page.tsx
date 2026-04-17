import { createClient } from "@/lib/supabase/server";
import { Settings, User, CreditCard, Shield, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { revalidatePath } from "next/cache";

async function updateProfile(formData: FormData) {
  'use server';
  const supabase = (await import("@/lib/supabase/server")).createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const full_name = formData.get("full_name") as string;

  await supabase
    .from("profiles")
    .update({ full_name })
    .eq("id", user.id);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  return (
    <div className="p-8 lg:p-12 pb-24 space-y-10 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
          Settings
          <Settings className="w-7 h-7 text-primary" />
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your profile and subscription.
        </p>
      </div>

      {/* Profile Section */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile
          </CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                <Input name="full_name" defaultValue={profile?.full_name || ""} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                <Input value={user?.email || ""} disabled className="opacity-50" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit" variant="primary" size="sm">Save Changes</Button>
              <Badge variant={profile?.role === 'admin' ? 'admin' : 'default'}>
                {profile?.role || 'user'}
              </Badge>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Subscription Section */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Subscription
          </CardTitle>
          <CardDescription>Manage your plan and billing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</p>
              <Badge variant={profile?.subscription_status === 'active' ? 'active' : 'inactive'} className="mt-1">
                {profile?.subscription_status || 'inactive'}
              </Badge>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Plan</p>
              <p className="text-lg font-black text-white capitalize">{profile?.subscription_plan || 'None'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Renewal</p>
              <p className="text-lg font-black text-white">
                {subscription?.current_period_end
                  ? new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "—"}
              </p>
            </div>
          </div>

          {profile?.subscription_status === 'active' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Need to cancel or update your plan?</p>
                <p className="text-xs text-amber-400 font-medium">Manage billing through Stripe's secure portal.</p>
              </div>
              <Button variant="glass" size="sm" className="shrink-0">
                <ExternalLink className="w-4 h-4 mr-2" />
                Billing Portal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <p className="text-sm font-bold text-white">Password</p>
              <p className="text-xs text-muted-foreground">Last changed: Unknown</p>
            </div>
            <Button variant="glass" size="sm" disabled>
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
