import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
} from "@/libs/supabaseAdmin";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: Request) {
  const body = await request.text();
  const rawHeaders = await headers(); // ✅ Correctly awaited
  const sig = rawHeaders.get("Stripe-Signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return new NextResponse("Missing Stripe signature or webhook secret", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log("✅ Stripe webhook received:", event.type);

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;

        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;

        case "checkout.session.completed":
          // Optional: Handle session completion (e.g., create user record)
          break;

        default:
          console.log(`⚠️ Unhandled event type: ${event.type}`);
      }
    } catch (err: any) {
      console.error("❌ Error handling Stripe event:", err.message);
      return new NextResponse("Webhook handler failed", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
