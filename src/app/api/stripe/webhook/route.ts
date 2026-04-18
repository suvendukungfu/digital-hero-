import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import Stripe from "stripe";

// Ensure Next.js doesn't parse the body before we read it as raw text
export const dynamic = "force-dynamic";

/**
 * Helper: Extract userId from various Stripe objects using a fallback chain.
 * 1. Session/Subscription metadata.userId
 * 2. Customer metadata.userId
 */
async function resolveUserId(obj: any): Promise<string | null> {
  // Try direct metadata first
  if (obj.metadata?.userId) {
    return obj.metadata.userId;
  }

  // Try to get it from the Stripe customer object
  const customerId = obj.customer as string | undefined;
  if (customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      if (!customer.deleted && customer.metadata?.userId) {
        return customer.metadata.userId;
      }
    } catch (e: any) {
      console.error("[WEBHOOK] Failed to retrieve customer:", e.message);
    }
  }

  return null;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[WEBHOOK] Missing STRIPE_WEBHOOK_SECRET env variable");
    return new NextResponse("Configuration Error", { status: 500 });
  }

  if (!signature) {
    console.error("[WEBHOOK] Missing Stripe-Signature header");
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error(`[WEBHOOK] Signature verification failed: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  console.log(`[WEBHOOK] Received event: ${event.type} (${event.id})`);

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      // ───────────────────────────────────────────
      // CHECKOUT COMPLETED (first-time subscription)
      // ───────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = await resolveUserId(session);
        const plan = session.metadata?.plan || "monthly";

        if (!userId) {
          console.error("[WEBHOOK] checkout.session.completed: Missing userId. Session:", session.id);
          break;
        }

        // Update profiles table
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            subscription_plan: plan,
            stripe_customer_id: session.customer as string,
          })
          .eq("id", userId);

        if (profileError) {
          console.error("[WEBHOOK] Profile update failed:", profileError.message);
          throw profileError;
        }

        // Upsert subscriptions table
        const { error: subError } = await supabase
          .from("subscriptions")
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              status: "active",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        if (subError) {
          console.error("[WEBHOOK] Subscription upsert failed:", subError.message);
          throw subError;
        }

        console.log(`[WEBHOOK] ✅ Subscription activated for user: ${userId} (plan: ${plan})`);
        break;
      }

      // ───────────────────────────────────────────
      // SUBSCRIPTION UPDATED
      // ───────────────────────────────────────────
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(subscription);

        if (!userId) {
          console.error("[WEBHOOK] subscription.updated: Missing userId. Sub:", subscription.id);
          break;
        }

        const status = subscription.status === "active" ? "active" : "inactive";

        await supabase
          .from("profiles")
          .update({ subscription_status: status })
          .eq("id", userId);

        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        console.log(`[WEBHOOK] ℹ️ Subscription updated for user: ${userId} (status: ${status})`);
        break;
      }

      // ───────────────────────────────────────────
      // SUBSCRIPTION DELETED (cancelled / expired)
      // ───────────────────────────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(subscription);

        if (!userId) {
          console.error("[WEBHOOK] subscription.deleted: Missing userId. Sub:", subscription.id);
          break;
        }

        await supabase
          .from("profiles")
          .update({ subscription_status: "inactive" })
          .eq("id", userId);

        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        console.log(`[WEBHOOK] ❌ Subscription deleted for user: ${userId}`);
        break;
      }

      // ───────────────────────────────────────────
      // INVOICE PAYMENT SUCCEEDED (recurring billing)
      // ───────────────────────────────────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        // Only process subscription invoices (not one-time)
        if (invoice.subscription) {
          const userId = await resolveUserId(invoice);
          if (userId) {
            await supabase
              .from("profiles")
              .update({ subscription_status: "active" })
              .eq("id", userId);

            console.log(`[WEBHOOK] 💳 Recurring payment succeeded for user: ${userId}`);
          }
        }
        break;
      }

      // ───────────────────────────────────────────
      // INVOICE PAYMENT FAILED
      // ───────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const userId = await resolveUserId(invoice);

        if (userId) {
          await supabase
            .from("profiles")
            .update({ subscription_status: "past_due" })
            .eq("id", userId);

          console.log(`[WEBHOOK] ⚠️ Payment failed for user: ${userId}`);
        }
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`[WEBHOOK] Database Error: ${error.message}`);
    return new NextResponse(`Database Error: ${error.message}`, { status: 500 });
  }
}
