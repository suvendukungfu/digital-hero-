import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const adminSupabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { plan } = body; // 'monthly' or 'yearly'

    if (!plan || !["monthly", "yearly"].includes(plan)) {
      return NextResponse.json({ error: "Plan must be 'monthly' or 'yearly'" }, { status: 400 });
    }

    const priceId = plan === 'yearly' 
      ? process.env.STRIPE_PRICE_ID_YEARLY 
      : process.env.STRIPE_PRICE_ID_MONTHLY;

    if (!priceId) {
      console.error("[STRIPE_CHECKOUT] Missing STRIPE_PRICE_ID for plan:", plan);
      return NextResponse.json({ error: "Invalid price configuration" }, { status: 500 });
    }

    // Attempt to get existing customer ID from profiles
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID back to profiles
      const { error: updateError } = await adminSupabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);

      if (updateError) {
        console.error("[STRIPE_CHECKOUT] Failed to save customer ID to profile:", updateError.message);
        // Non-fatal; continue with checkout
      }
    } else {
      // Ensure existing Stripe customer has userId metadata
      try {
        await stripe.customers.update(customerId, {
          metadata: { userId: user.id },
        });
      } catch (e: any) {
        console.error("[STRIPE_CHECKOUT] Failed to update customer metadata:", e.message);
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: {
        userId: user.id,
        plan: plan,
      },
      // CRITICAL: Pass metadata to the subscription object itself
      // so webhook events like subscription.updated/deleted can access userId
      subscription_data: {
        metadata: {
          userId: user.id,
          plan: plan,
        },
      },
    });

    console.log(`[STRIPE_CHECKOUT] Session created: ${checkoutSession.id} for user ${user.id}`);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT] Fatal error:", error.message);
    return NextResponse.json(
      { error: `Checkout failed: ${error.message}` },
      { status: 500 }
    );
  }
}
