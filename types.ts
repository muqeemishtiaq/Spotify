import Stripe from "stripe";

export interface Song {
    id: string;
    title: string;
    author: string;
    user_id: string;
    song_path: string;
    image_path: string;
}
export interface UserDetails {
    id: string;
    first_name: string;
    full_name?: string;
    email: string;
    avatar_url?: string;
    billing_address?: Stripe.Address;
    payment_method?: Stripe.PaymentMethod [Stripe.PaymentMethod.Type];
   
}

export interface Subscription {
    id: string;
    user_id: string;
    status?: string;
    metadata?:Stripe.Metadata;
    price_id?: string;
    quantity?: number;
    cancel_at_period_end?: boolean;
    cancel_at?: string;
    canceled_at?: string;
    current_period_end?: string;
    current_period_start?: string;
    created?: string;
    ended_at?: string;
    trial_end?: string;
    trial_start?: string;
    prices?: Price;

}
export interface Price {
    id: string;
    product_id: string;
    active?: boolean;
    description?: string;
    unit_amount?: number | null;
    currency?: string;
    type? : string;
    interval: string;
    interval_count: number;
    trial_period_days: number | null;
    metadata?: Stripe.Metadata;
    products?: Product;
}



export interface Product {
  id: string; 
  active?: boolean;
  name?: string;
  description?: string | null; 
  images?: string[];
  metadata?: Stripe.Metadata;
}
