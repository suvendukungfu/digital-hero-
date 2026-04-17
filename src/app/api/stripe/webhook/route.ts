import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new NextResponse("Configuration Error", { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error: any) {
    console.error(`Webhook Signature Verification Failed: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const supabase = createAdminClient();
  const session = event.data.object as any;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (!userId) {
          console.error("Missing userId in session metadata");
          break;
        }

        // Update profiles table with active subscription data
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            subscription_plan: plan || "monthly",
            stripe_customer_id: session.customer as string,
          })
          .eq("id", userId);

        if (profileError) throw profileError;

        // Also update sub-table for detailed tracking
        await supabase
          .from("subscriptions")
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: "active",
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

        console.log(`✅ Subscription activated for user: ${userId}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const customer = await stripe.customers.retrieve(subscription.customer as string) as any;
        const userId = customer.metadata?.userId;

        if (userId) {
          const status = subscription.status === "active" ? "active" : "inactive";
          
          await supabase
            .from("profiles")
            .update({ subscription_status: status })
            .eq("id", userId);

          await supabase
            .from("subscriptions")
            .update({ status: subscription.status })
            .eq("stripe_subscription_id", subscription.id);
            
          console.log(`ℹ️ Subscription updated for user: ${userId} (Status: ${status})`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const customer = await stripe.customers.retrieve(subscription.customer as string) as any;
        const userId = customer.metadata?.userId;

        if (userId) {
          await supabase
            .from("profiles")
            .update({ subscription_status: "inactive" })
            .eq("id", userId);

          await supabase
            .from("subscriptions")
            .update({ status: "canceled" })
            .eq("stripe_subscription_id", subscription.id);

          console.log(`❌ Subscription deleted for user: ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Webhook Database Error: ${error.message}`);
    return new NextResponse(`Database Error: ${error.message}`, { status: 500 });
  }
}
