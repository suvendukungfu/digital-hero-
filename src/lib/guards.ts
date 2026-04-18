import { createClient } from "@/lib/supabase/server";

/**
 * Shared subscription guard for Server Actions.
 * Call at the top of any action that requires an active subscription.
 * Returns the authenticated user; throws if unauthorized or unsubscribed.
 */
export async function requireActiveSubscription() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: You must be signed in.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, role")
    .eq("id", user.id)
    .single();

  // Admins bypass subscription checks
  if (profile?.role === "admin") {
    return { user, supabase, profile };
  }

  if (profile?.subscription_status !== "active") {
    throw new Error("Subscription required: Please subscribe to access this feature.");
  }

  return { user, supabase, profile };
}

/**
 * Lighter guard — just checks auth, not subscription.
 * Use for settings/profile pages where unsubscribed users might still need access.
 */
export async function requireAuth() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: You must be signed in.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, role, full_name, subscription_plan")
    .eq("id", user.id)
    .single();

  return { user, supabase, profile };
}
