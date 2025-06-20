import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/libs/stripe";
import {
  supabaseAdmin,
  upsertPriceRecord,
  upsertProductRecord,
} from "@/libs/supabaseAdmin";

// ✅ Optional: import strong typing for update
import { Database } from "@/database.types";

type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
]);

export async function POST(request: Request) {
  const body = await request.text();
  const rawHeaders = await headers(); // ✅ fix: added await
  const sig = rawHeaders.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Missing Stripe signature or secret", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Webhook error:", message);
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
          if (!userId) throw new Error("Missing userId in metadata");

          const updatePayload: UserUpdate = {
            is_premium: true,
          };

          await supabaseAdmin
            .from("users")
            .update(updatePayload)
            .eq("id", userId);

          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error("❌ Handler error:", err);
      return new NextResponse("Handler Error", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
