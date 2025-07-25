export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
    id: number;
    created_at: string;
    
    uuid: string;
    stripe_customer_id: string;
  };Insert: {
    id?: number;
    created_at?: string;
    uuid: string;
    stripe_customer_id: string;
  };
        Update: {
    id?: number;
    created_at?: string;
    uuid?: string;
    stripe_customer_id?: string;
  };
        Relationships: []
      },
      liked_songs: {
        Row: {
          created_at: string
          song_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          song_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          song_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "liked_songs_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      prices: {
        Row: {
          created_at: string;
          id: string;
          product_id: string;
          active: boolean;
          description: string | null;
          unit_amount: number | null;
          currency: string;
          type: string;
          interval: string;
          interval_count: number;
          trial_period_days: number | null;
          metadata: Json;
        };
        Insert: {
          created_at?: string;
          id: string;
          product_id: string;
          active?: boolean;
          description?: string | null;
          unit_amount?: number | null;
          currency?: string;
          type?: string;
          interval?: string;
          interval_count?: number;
          trial_period_days?: number | null;
          metadata?: Json;
        };
        Update: {
          created_at?: string;
          id?: string;
          product_id?: string;
          active?: boolean;
          description?: string | null;
          unit_amount?: number | null;
          currency?: string;
          type?: string;
          interval?: string;
          interval_count?: number;
          trial_period_days?: number | null;
          metadata?: Json;
        };
        Relationships: []
      },
      products: {
        Row: {
          created_at: string;
          id: string;
          active: boolean;
          name: string;
          description: string | null;
          metadata: Json;
          images: string[];
        };
        Insert: {
          created_at?: string;
          id: string;
          active?: boolean;
          name?: string;
          description?: string | null;
          metadata?: Json;
          images?: string[];
        };
        Update: {
          created_at?: string;
          id?: string;
          active?: boolean;
          name?: string;
          description?: string | null;
          metadata?: Json;
          images?: string[];
        };
        Relationships: []
      },
      songs: {
        Row: {
          author: string | null
          created_at: string
          id: number
          image_path: string | null
          song_path: string | null
          title: string | null
          userId: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string
          id?: number
          image_path?: string | null
          song_path?: string | null
          title?: string | null
          userId?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string
          id?: number
          image_path?: string | null
          song_path?: string | null
          title?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "songs_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      subscriptions: {
         Row: {
    id: number;
    user_id: string;
    stripe_subscription_id: string;
    created_at: string;
    
  };
  Insert: {
    id?: number;
    user_id: string;
    stripe_subscription_id?: string;
    created_at?: string;
  };
  Update: {
    id?: number;
    user_id?: string;
    stripe_subscription_id?: string;
    created_at?: string;
  };
        Relationships: []
      },
      users: {
  Row: {
    id: string;
    created_at: string;
    uuid: string;
    stripe_customer_id: string;
    billing_address: any;
    payment_method: any;
    is_premium: boolean | null; // ✅ Add this
  };
  Insert: {
    id?: string;
    created_at?: string;
    uuid: string;
    stripe_customer_id: string;
    billing_address?: any;
    payment_method?: any;
    is_premium?: boolean | null; // ✅ Add this
  };
  Update: {
    id?: string;
    created_at?: string;
    uuid?: string;
    stripe_customer_id?: string;
    billing_address?: any;
    payment_method?: any;
    is_premium?: boolean | null; // ✅ Add this
  };
  Relationships: []
}

    },
    Views: {
      [_ in never]: never
    },
    Functions: {
      [_ in never]: never
    },
    Enums: {
      [_ in never]: never
    },
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type TablesInsert<
  TableName extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][TableName]["Insert"];

export type TablesUpdate<
  TableName extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][TableName]["Update"];

export type Enums<EnumName extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][EnumName];
