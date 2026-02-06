-- =====================================================
-- HYPERLOCAL MARKETPLACE DATABASE SCHEMA
-- =====================================================

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('consumer', 'seller', 'admin');

-- Create listing_type enum
CREATE TYPE public.listing_type AS ENUM ('service', 'product');

-- Create listing_status enum
CREATE TYPE public.listing_status AS ENUM ('draft', 'active', 'paused', 'expired');

-- Create lead_status enum
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'converted', 'closed');

-- Create subscription_plan enum
CREATE TYPE public.subscription_plan AS ENUM ('free', 'premium', 'enterprise');

-- Create payment_status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create transaction_type enum
CREATE TYPE public.transaction_type AS ENUM ('subscription', 'boost', 'featured');

-- =====================================================
-- USER PROFILES TABLE
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  stripe_customer_id TEXT,
  default_location_id UUID,
  mode TEXT DEFAULT 'consumer' CHECK (mode IN ('consumer', 'seller')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- USER ROLES TABLE (SEPARATE FROM PROFILES - SECURITY CRITICAL)
-- =====================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id),
  listing_type listing_type DEFAULT 'service',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- LOCATIONS TABLE
-- =====================================================
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'India',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- LISTINGS TABLE
-- =====================================================
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  location_id UUID REFERENCES public.locations(id) NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  listing_type listing_type NOT NULL DEFAULT 'service',
  price DECIMAL(12, 2),
  price_unit TEXT DEFAULT 'fixed',
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  status listing_status DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  is_boosted BOOLEAN DEFAULT false,
  boost_expires_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index for faster searches
CREATE INDEX idx_listings_category ON public.listings(category_id);
CREATE INDEX idx_listings_location ON public.listings(location_id);
CREATE INDEX idx_listings_seller ON public.listings(seller_id);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_search ON public.listings USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- =====================================================
-- LEADS TABLE
-- =====================================================
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  consumer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  contact_method TEXT DEFAULT 'app',
  status lead_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_leads_listing ON public.leads(listing_id);
CREATE INDEX idx_leads_consumer ON public.leads(consumer_id);
CREATE INDEX idx_leads_seller ON public.leads(seller_id);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(listing_id, reviewer_id)
);

CREATE INDEX idx_reviews_listing ON public.reviews(listing_id);

-- =====================================================
-- WISHLISTS TABLE
-- =====================================================
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(consumer_id, listing_id)
);

-- =====================================================
-- SELLER SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE public.seller_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan subscription_plan DEFAULT 'free' NOT NULL,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_subscriptions_seller ON public.seller_subscriptions(seller_id);

-- =====================================================
-- LISTING BOOSTS TABLE
-- =====================================================
CREATE TABLE public.listing_boosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  boost_level INTEGER DEFAULT 1 CHECK (boost_level >= 1 AND boost_level <= 3),
  stripe_payment_intent_id TEXT,
  amount_paid DECIMAL(12, 2),
  starts_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  transaction_type transaction_type NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status payment_status DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_transactions_user ON public.transactions(user_id);
CREATE INDEX idx_transactions_stripe ON public.transactions(stripe_payment_intent_id);

-- =====================================================
-- AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_audit_logs_admin ON public.audit_logs(admin_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- =====================================================
-- HELPER FUNCTIONS (SECURITY DEFINER - AVOID RLS RECURSION)
-- =====================================================

-- Check if current user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Check if current user is a seller
CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'seller')
$$;

-- Get current user's profile id
CREATE OR REPLACE FUNCTION public.get_my_profile_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
$$;

-- Check if current user owns a listing
CREATE OR REPLACE FUNCTION public.is_listing_owner(_listing_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.listings l
    JOIN public.profiles p ON l.seller_id = p.id
    WHERE l.id = _listing_id AND p.user_id = auth.uid()
  )
$$;

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: PROFILES
-- =====================================================
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- =====================================================
-- RLS POLICIES: USER ROLES
-- =====================================================
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Only admins can manage roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

-- Allow initial role assignment during signup
CREATE POLICY "Users can insert own initial role" ON public.user_roles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- =====================================================
-- RLS POLICIES: CATEGORIES (Public read, admin write)
-- =====================================================
CREATE POLICY "Categories are publicly readable" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- =====================================================
-- RLS POLICIES: LOCATIONS (Public read, admin write)
-- =====================================================
CREATE POLICY "Locations are publicly readable" ON public.locations
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage locations" ON public.locations
  FOR ALL USING (public.is_admin());

-- =====================================================
-- RLS POLICIES: LISTINGS
-- =====================================================
CREATE POLICY "Public listings are readable by all" ON public.listings
  FOR SELECT USING (status = 'active' OR public.is_listing_owner(id) OR public.is_admin());

CREATE POLICY "Sellers can create listings" ON public.listings
  FOR INSERT WITH CHECK (seller_id = public.get_my_profile_id() AND public.is_seller());

CREATE POLICY "Sellers can update own listings" ON public.listings
  FOR UPDATE USING (public.is_listing_owner(id) OR public.is_admin());

CREATE POLICY "Sellers can delete own listings" ON public.listings
  FOR DELETE USING (public.is_listing_owner(id) OR public.is_admin());

-- =====================================================
-- RLS POLICIES: LEADS
-- =====================================================
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT USING (
    consumer_id = public.get_my_profile_id() 
    OR seller_id = public.get_my_profile_id() 
    OR public.is_admin()
  );

CREATE POLICY "Consumers can create leads" ON public.leads
  FOR INSERT WITH CHECK (consumer_id = public.get_my_profile_id());

CREATE POLICY "Lead participants can update" ON public.leads
  FOR UPDATE USING (
    consumer_id = public.get_my_profile_id() 
    OR seller_id = public.get_my_profile_id() 
    OR public.is_admin()
  );

-- =====================================================
-- RLS POLICIES: REVIEWS
-- =====================================================
CREATE POLICY "Reviews on active listings are public" ON public.reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND status = 'active')
    OR reviewer_id = public.get_my_profile_id()
    OR public.is_admin()
  );

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (reviewer_id = public.get_my_profile_id());

CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (reviewer_id = public.get_my_profile_id() OR public.is_admin());

CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (reviewer_id = public.get_my_profile_id() OR public.is_admin());

-- =====================================================
-- RLS POLICIES: WISHLISTS
-- =====================================================
CREATE POLICY "Users can manage own wishlists" ON public.wishlists
  FOR ALL USING (consumer_id = public.get_my_profile_id() OR public.is_admin());

-- =====================================================
-- RLS POLICIES: SELLER SUBSCRIPTIONS
-- =====================================================
CREATE POLICY "Sellers can view own subscriptions" ON public.seller_subscriptions
  FOR SELECT USING (seller_id = public.get_my_profile_id() OR public.is_admin());

CREATE POLICY "Sellers can manage own subscriptions" ON public.seller_subscriptions
  FOR ALL USING (seller_id = public.get_my_profile_id() OR public.is_admin());

-- =====================================================
-- RLS POLICIES: LISTING BOOSTS
-- =====================================================
CREATE POLICY "Boost info visible to listing owners" ON public.listing_boosts
  FOR SELECT USING (public.is_listing_owner(listing_id) OR public.is_admin());

CREATE POLICY "Sellers can create boosts" ON public.listing_boosts
  FOR INSERT WITH CHECK (public.is_listing_owner(listing_id));

-- =====================================================
-- RLS POLICIES: TRANSACTIONS
-- =====================================================
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (user_id = public.get_my_profile_id() OR public.is_admin());

CREATE POLICY "Users can create transactions" ON public.transactions
  FOR INSERT WITH CHECK (user_id = public.get_my_profile_id());

CREATE POLICY "System can update transactions" ON public.transactions
  FOR UPDATE USING (user_id = public.get_my_profile_id() OR public.is_admin());

-- =====================================================
-- RLS POLICIES: AUDIT LOGS
-- =====================================================
CREATE POLICY "Only admins can access audit logs" ON public.audit_logs
  FOR ALL USING (public.is_admin());

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.seller_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- TRIGGER: AUTO-CREATE PROFILE ON USER SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SEED DATA: DEFAULT CATEGORIES
-- =====================================================
INSERT INTO public.categories (name, slug, icon, listing_type, sort_order) VALUES
  ('Home Services', 'home-services', 'Home', 'service', 1),
  ('Personal Care', 'personal-care', 'Sparkles', 'service', 2),
  ('Education & Tutoring', 'education', 'GraduationCap', 'service', 3),
  ('Health & Fitness', 'health-fitness', 'Heart', 'service', 4),
  ('Events & Entertainment', 'events', 'PartyPopper', 'service', 5),
  ('Automotive', 'automotive', 'Car', 'service', 6),
  ('Electronics', 'electronics', 'Laptop', 'product', 7),
  ('Fashion', 'fashion', 'Shirt', 'product', 8),
  ('Home & Living', 'home-living', 'Sofa', 'product', 9),
  ('Food & Grocery', 'food-grocery', 'ShoppingBag', 'product', 10);

-- =====================================================
-- SEED DATA: DEFAULT LOCATIONS
-- =====================================================
INSERT INTO public.locations (name, slug, city, state, country) VALUES
  ('San Francisco', 'san-francisco', 'San Francisco', 'California', 'USA'),
  ('New York', 'new-york', 'New York', 'New York', 'USA'),
  ('Los Angeles', 'los-angeles', 'Los Angeles', 'California', 'USA'),
  ('Chicago', 'chicago', 'Chicago', 'Illinois', 'USA'),
  ('Austin', 'austin', 'Austin', 'Texas', 'USA'),
  ('Seattle', 'seattle', 'Seattle', 'Washington', 'USA'),
  ('Miami', 'miami', 'Miami', 'Florida', 'USA'),
  ('Denver', 'denver', 'Denver', 'Colorado', 'USA');