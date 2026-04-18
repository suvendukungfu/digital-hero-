import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Routes that require an active subscription to access.
 * Settings page is excluded — users need it to manage their account even when unsubscribed.
 */
const SUBSCRIPTION_PROTECTED_PATHS = [
  "/dashboard/scores",
  "/dashboard/draws",
  "/dashboard/charity",
];

/**
 * Routes that are always public (no auth needed).
 */
const PUBLIC_PATHS = ["/", "/auth", "/pricing", "/success", "/cancel"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, any> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith('/auth');
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  const isApiRoute = pathname.startsWith('/api');

  // ─── 1. Unauthenticated user trying to access protected page ─────
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  // ─── 2. Authenticated user trying to access auth page ─────────────
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // ─── 3. Admin role check ──────────────────────────────────────────
  if (user && pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // ─── 4. Subscription check for protected dashboard routes ─────────
  if (user && SUBSCRIPTION_PROTECTED_PATHS.some(p => pathname.startsWith(p))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, role')
      .eq('id', user.id)
      .single();

    // Admins always pass
    if (profile?.role !== 'admin' && profile?.subscription_status !== 'active') {
      const url = request.nextUrl.clone();
      url.pathname = '/pricing';
      url.searchParams.set('reason', 'subscription_required');
      return NextResponse.redirect(url);
    }
  }

  // ─── 5. API route subscription protection ─────────────────────────
  // Stripe and auth callbacks must remain unprotected
  const UNPROTECTED_API_PATHS = ['/api/stripe', '/api/auth', '/api/cron'];
  if (
    user &&
    isApiRoute &&
    !UNPROTECTED_API_PATHS.some(p => pathname.startsWith(p))
  ) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && profile?.subscription_status !== 'active') {
      return NextResponse.json(
        { error: "Active subscription required to access this resource." },
        { status: 403 }
      );
    }
  }

  return supabaseResponse;
}
