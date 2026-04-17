import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const adminSupabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { plan } = body; // 'monthly' or 'yearly'

    if (!plan) {
      return new NextResponse("Plan is required", { status: 400 });
    }

    const priceId = plan === 'yearly' 
      ? process.env.STRIPE_PRICE_ID_YEARLY 
      : process.env.STRIPE_PRICE_ID_MONTHLY;

    if (!priceId) {
      return new NextResponse("Invalid price configuration", { status: 500 });
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
                userId: user.id
            }
        });
        customerId = customer.id;

        // Save customer ID back to profiles
        await adminSupabase
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);
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
          plan: plan
      }
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT]", error);
    return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
  }
}
