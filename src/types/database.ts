// Database types for the marketplace
export type AppRole = 'consumer' | 'seller' | 'admin';
export type ListingType = 'service' | 'product';
export type ListingStatus = 'draft' | 'active' | 'paused' | 'expired';
export type LeadStatus = 'new' | 'contacted' | 'converted' | 'closed';
export type SubscriptionPlan = 'free' | 'premium' | 'enterprise';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type TransactionType = 'subscription' | 'boost' | 'featured';
export type UserMode = 'consumer' | 'seller';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  stripe_customer_id: string | null;
  default_location_id: string | null;
  mode: UserMode;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  parent_id: string | null;
  listing_type: ListingType;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  category_id: string;
  location_id: string;
  title: string;
  slug: string;
  description: string | null;
  listing_type: ListingType;
  price: number | null;
  price_unit: string;
  images: string[];
  features: string[];
  status: ListingStatus;
  is_featured: boolean;
  is_boosted: boolean;
  boost_expires_at: string | null;
  views_count: number;
  leads_count: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
  location?: Location;
  seller?: Profile;
  reviews?: Review[];
  average_rating?: number;
  review_count?: number;
}

export interface Lead {
  id: string;
  listing_id: string;
  consumer_id: string;
  seller_id: string;
  message: string | null;
  contact_method: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
  // Joined fields
  listing?: Listing;
  consumer?: Profile;
}

export interface Review {
  id: string;
  listing_id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  reviewer?: Profile;
}

export interface Wishlist {
  id: string;
  consumer_id: string;
  listing_id: string;
  created_at: string;
  // Joined fields
  listing?: Listing;
}

export interface SellerSubscription {
  id: string;
  seller_id: string;
  plan: SubscriptionPlan;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListingBoost {
  id: string;
  listing_id: string;
  boost_level: number;
  stripe_payment_intent_id: string | null;
  amount_paid: number | null;
  starts_at: string;
  expires_at: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: TransactionType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripe_payment_intent_id: string | null;
  stripe_invoice_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SellerStats {
  totalViews: number;
  totalLeads: number;
  totalListings: number;
  activeListings: number;
  conversionRate: number;
  totalEarnings: number;
}
