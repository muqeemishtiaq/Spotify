import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/libs/stripe";
import { supabaseAdmin, upsertPriceRecord, upsertProductRecord } from "@/libs/supabaseAdmin";

// Define the Stripe event types your app cares about
const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
]);

export async function POST(request: Request) {
  const body = await request.text();

  const headersList = await headers(); // ✅ Fix: await the headers
  const sig = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown webhook error";
    console.error("Webhook signature verification failed:", message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

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

        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;

          const userId = session?.metadata?.userId;
          if (!userId) {
            throw new Error("Missing userId in session metadata.");
          }

          // ✅ Fix: Add `as any` if is_premium is not typed
          await supabaseAdmin
            .from("users")
            .update({
              is_premium: true,
            } as any)
            .eq("id", userId);

          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown processing error";
      console.error(`Webhook handler failed: ${message}`);
      return new NextResponse("Webhook handler error", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
