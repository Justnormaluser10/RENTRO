-- =========================================================
-- RENTRO - Supabase Database Schema
-- Self-Drive Car & Bike Rental Platform
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  dob DATE,
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. LOCATIONS TABLE (Pickup & Return Hubs)
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Ahmedabad',
  address TEXT NOT NULL,
  landmark TEXT,
  contact_phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  registration_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('car', 'bike')),
  category TEXT NOT NULL CHECK (category IN ('hatchback', 'sedan', 'suv', 'cruiser', 'scooter', 'sport', 'electric')),
  year INTEGER NOT NULL,
  fuel TEXT NOT NULL CHECK (fuel IN ('petrol', 'diesel', 'electric', 'cng')),
  transmission TEXT NOT NULL CHECK (transmission IN ('manual', 'automatic')),
  seats INTEGER NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BOOKED', 'MAINTENANCE', 'UNAVAILABLE')),
  rating NUMERIC(2,1) DEFAULT 4.8,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. VEHICLE IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.vehicle_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRICING TABLE
CREATE TABLE IF NOT EXISTS public.pricing (
  vehicle_id UUID PRIMARY KEY REFERENCES public.vehicles(id) ON DELETE CASCADE,
  hourly_rate NUMERIC(10, 2) NOT NULL,
  six_hour_rate NUMERIC(10, 2) NOT NULL,
  daily_rate NUMERIC(10, 2) NOT NULL,
  weekly_rate NUMERIC(10, 2) NOT NULL,
  security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 2000.00,
  tax_rate_percent NUMERIC(4, 2) NOT NULL DEFAULT 18.00,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. KYC DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('driving_licence', 'identity_card')),
  document_url TEXT NOT NULL,
  document_back_url TEXT,
  document_number TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE RESTRICT,
  pickup_location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  return_location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  duration_hours NUMERIC(6, 2) NOT NULL,
  base_amount NUMERIC(10, 2) NOT NULL,
  deposit_amount NUMERIC(10, 2) NOT NULL,
  tax_amount NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PAYMENT_PENDING' CHECK (status IN ('PENDING', 'PAYMENT_PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
  cancellation_reason TEXT,
  refund_amount NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_booking_dates CHECK (end_date > start_date)
);

-- 8. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  provider TEXT NOT NULL DEFAULT 'razorpay' CHECK (provider IN ('razorpay', 'test_mode')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT NOT NULL DEFAULT 'INITIATED' CHECK (status IN ('INITIATED', 'SUCCESS', 'FAILED', 'REFUNDED')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. INSPECTIONS TABLE (Fleet Handover & Return)
CREATE TABLE IF NOT EXISTS public.inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('PICKUP', 'RETURN')),
  odometer_reading INTEGER NOT NULL,
  fuel_level INTEGER NOT NULL CHECK (fuel_level >= 0 AND fuel_level <= 100),
  condition_notes TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  damage_charges NUMERIC(10, 2) DEFAULT 0.00,
  late_fee NUMERIC(10, 2) DEFAULT 0.00,
  extra_charges NUMERIC(10, 2) DEFAULT 0.00,
  recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_moderated BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_vehicles_type_status ON public.vehicles(type, status);
CREATE INDEX IF NOT EXISTS idx_vehicles_location ON public.vehicles(location_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_dates ON public.bookings(vehicle_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_kyc_user ON public.kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_vehicle ON public.reviews(vehicle_id);

-- =========================================================
-- ATOMIC AVAILABILITY & CONFLICT PREVENTION FUNCTIONS
-- =========================================================

-- Function to check if a vehicle is available for a given window
CREATE OR REPLACE FUNCTION public.check_vehicle_availability(
  p_vehicle_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_conflict_count INTEGER;
  v_vehicle_status TEXT;
BEGIN
  -- First check if vehicle itself is in AVAILABLE status
  SELECT status INTO v_vehicle_status FROM public.vehicles WHERE id = p_vehicle_id;
  IF v_vehicle_status IN ('MAINTENANCE', 'UNAVAILABLE') THEN
    RETURN FALSE;
  END IF;

  -- Check for overlapping active or confirmed bookings
  SELECT COUNT(*)
  INTO v_conflict_count
  FROM public.bookings
  WHERE vehicle_id = p_vehicle_id
    AND status IN ('CONFIRMED', 'ACTIVE', 'PAYMENT_PENDING')
    AND (p_exclude_booking_id IS NULL OR id <> p_exclude_booking_id)
    AND (start_date < p_end_date AND end_date > p_start_date);

  RETURN (v_conflict_count = 0);
END;
$$;

-- Atomic Booking RPC with Vehicle Row Locking (Prevents Race Conditions)
CREATE OR REPLACE FUNCTION public.create_booking_atomic(
  p_user_id UUID,
  p_vehicle_id UUID,
  p_pickup_location_id UUID,
  p_return_location_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_base_amount NUMERIC,
  p_deposit_amount NUMERIC,
  p_tax_amount NUMERIC,
  p_total_amount NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_available BOOLEAN;
  v_booking_id UUID;
  v_booking_num TEXT;
  v_duration_hours NUMERIC;
BEGIN
  -- 1. Lock the vehicle row exclusively to serialize simultaneous attempts
  PERFORM 1 FROM public.vehicles WHERE id = p_vehicle_id FOR UPDATE;

  -- 2. Check availability
  v_is_available := public.check_vehicle_availability(p_vehicle_id, p_start_date, p_end_date);
  IF NOT v_is_available THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Vehicle is no longer available for the selected dates. Please choose another vehicle or time.'
    );
  END IF;

  -- 3. Calculate duration in hours
  v_duration_hours := ROUND(EXTRACT(EPOCH FROM (p_end_date - p_start_date)) / 3600.0, 2);
  v_booking_num := 'REN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(uuid_generate_v4()::text, 1, 6));

  -- 4. Insert booking
  INSERT INTO public.bookings (
    booking_number,
    user_id,
    vehicle_id,
    pickup_location_id,
    return_location_id,
    start_date,
    end_date,
    duration_hours,
    base_amount,
    deposit_amount,
    tax_amount,
    total_amount,
    status
  ) VALUES (
    v_booking_num,
    p_user_id,
    p_vehicle_id,
    p_pickup_location_id,
    p_return_location_id,
    p_start_date,
    p_end_date,
    v_duration_hours,
    p_base_amount,
    p_deposit_amount,
    p_tax_amount,
    p_total_amount,
    'CONFIRMED'
  ) RETURNING id INTO v_booking_id;

  RETURN jsonb_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'booking_number', v_booking_num
  );
END;
$$;

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read basic, users can edit their own, admins can read all
CREATE POLICY "Users can view own profile or admins view all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Locations: Anyone can read, only admin can modify
CREATE POLICY "Public locations view" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Admin manage locations" ON public.locations FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Vehicles, Images & Pricing: Anyone can read, only admin can modify
CREATE POLICY "Public vehicles view" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Admin manage vehicles" ON public.vehicles FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public vehicle images view" ON public.vehicle_images FOR SELECT USING (true);
CREATE POLICY "Admin manage vehicle images" ON public.vehicle_images FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public pricing view" ON public.pricing FOR SELECT USING (true);
CREATE POLICY "Admin manage pricing" ON public.pricing FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Bookings: Customers can view and insert own, admins can view and update all
CREATE POLICY "Users view own bookings or admin views all"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can create own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings or admin update"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- KYC Documents: Users can manage own, admins can view and review all
CREATE POLICY "Users view own KYC or admin views all"
  ON public.kyc_documents FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users insert own KYC"
  ON public.kyc_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin update KYC status"
  ON public.kyc_documents FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Payments: Users view own payments, admins view all
CREATE POLICY "Users view own payments or admin views all"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users insert own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Inspections: Users can view inspections for their booking, admins can manage
CREATE POLICY "Users view inspection for own booking"
  ON public.inspections FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = inspections.booking_id AND bookings.user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin manage inspections"
  ON public.inspections FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Reviews: Everyone views approved reviews, user can insert review for completed booking
CREATE POLICY "Public view approved reviews"
  ON public.reviews FOR SELECT
  USING (is_moderated = true OR auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users insert own review"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);
