import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Database, TablesInsert } from "@/database.types";
import { Price } from "@/types";
import { stripe } from "./stripe";
import { toDateTime } from "./helpers";

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

type ProductInsert = TablesInsert<"products">;

export const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: ProductInsert = {
    id: product.id,
    active: product.active ?? false,
    name: product.name,
    description: product.description ?? undefined,
    metadata: product.metadata,
    images: product.images ?? [],
  };

  const { error } = await supabaseAdmin.from("products").upsert([productData]);

  if (error) throw new Error(`Failed to upsert product: ${error.message}`);
  console.log(`✅ Product with ID: ${product.id} has been upserted.`);
};

export const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    description: price.nickname ?? undefined,
    unit_amount: price.unit_amount ?? undefined,
    currency: price.currency,
    type: price.type,
    interval: price.recurring?.interval ?? "",
    interval_count: price.recurring?.interval_count ?? 1,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  };

  const { error } = await supabaseAdmin.from("prices").upsert([priceData]);
  if (error) throw new Error(`Failed to upsert price: ${error.message}`);
  console.log(`✅ Price with ID: ${price.id} has been upserted.`);
};

export const createOrRetriveACustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("uuid", uuid)
    .single();

  if (error || !data?.stripe_customer_id) {
    const customer = await stripe.customers.create({
      metadata: { supabaseUUID: uuid },
      email,
    });

    const { error: insertError } = await supabaseAdmin
      .from("customers")
      .insert([{ stripe_customer_id: customer.id, uuid }]);

    if (insertError) throw insertError;

    console.log(`✅ New customer created: ${customer.id}`);
    return customer.id;
  }

  return data.stripe_customer_id;
};

export const copyBillingDetailsToCustomer = async ({
  uuid,
  payment_method,
}: {
  uuid: string;
  payment_method: Stripe.PaymentMethod;
}) => {
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;

  if (!name || !phone || !address) return;

  const sanitizedAddress = {
    city: address.city ?? undefined,
    country: address.country ?? undefined,
    line1: address.line1 ?? undefined,
    line2: address.line2 ?? undefined,
    postal_code: address.postal_code ?? undefined,
    state: address.state ?? undefined,
  };

  await stripe.customers.update(customer, {
    name,
    phone,
    address: sanitizedAddress,
  });

  const { error } = await supabaseAdmin
    .from("users")
    .update({
      billing_address: { ...sanitizedAddress },
      payment_method: { ...(payment_method[payment_method.type] as object) },
    })
    .eq("id", uuid);

  if (error) {
    console.error("❌ Error copying billing details:", error.message);
    throw error;
  }
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  const { data: customer, error: customerError } = await supabaseAdmin
    .from("customers")
    .select("uuid")
    .eq("stripe_customer_id", customerId)
    .single();

  if (customerError) throw customerError;

  const { uuid } = customer;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  const subscriptionData = {
    user_id: uuid,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    price_id: subscription.items.data[0]?.price.id ?? "",
    quantity: subscription.items.data[0]?.quantity ?? 1,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at,
    canceled_at: subscription.canceled_at,
    created_at: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start ?? null,
    trial_end: subscription.trial_end ?? null,
    metadata: subscription.metadata ?? {},
  };

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData]);

  if (error) throw error;

  console.log(`✅ Subscription with ID: ${subscription.id} has been upserted.`);

  if (createAction && subscription.default_payment_method) {
    await copyBillingDetailsToCustomer({
      uuid,
      payment_method: subscription.default_payment_method as Stripe.PaymentMethod,
    });
  }
};
