import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

/**
 * API Route: /api/admin/system-check
 * Purpose: A secure endpoint for admin-only system diagnostics.
 * Security: Uses standard client for session check, Admin client for data.
 */
export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const adminSupabase = createAdminClient();

    // Verify User Role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Example sensitive data fetch only admins can do with high-privilege client
    const { count: totalUsers } = await adminSupabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: totalSubscriptions } = await adminSupabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
        status: "healthy",
        metrics: {
            totalUsers,
            totalSubscriptions
        }
    });

  } catch (error: any) {
    console.error("[API_ADMIN_CHECK_ERROR]", error);
    return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
  }
}
