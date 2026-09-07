-- =========================================================
-- RENTRO - Ahmedabad Mobility Hubs Seed Data
-- Zero dummy vehicles (Admin will add real fleet via /admin)
-- =========================================================

-- Insert 5 Ahmedabad Mobility Hubs
INSERT INTO public.locations (id, name, city, address, landmark, contact_phone, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'SG Highway Mobility Hub', 'Ahmedabad', 'Near ISCON Cross Road, Bodakdev, SG Highway', 'Opposite ISCON Mega Mall', '+91 98765 43210', true),
  ('11111111-1111-1111-1111-111111111102', 'Prahlad Nagar Hub', 'Ahmedabad', 'Corporate Road, Near Prahlad Nagar Garden', 'Behind Titanium City Centre', '+91 98765 43211', true),
  ('11111111-1111-1111-1111-111111111103', 'Navrangpura & C.G. Road Hub', 'Ahmedabad', 'Near Municipal Market, C.G. Road, Navrangpura', 'Near Samartheshwar Mahadev', '+91 98765 43212', true),
  ('11111111-1111-1111-1111-111111111104', 'Vastrapur & Satellite Hub', 'Ahmedabad', 'Near Vastrapur Lake, Premchand Nagar Road', 'Near Ahmedabad One Mall', '+91 98765 43213', true),
  ('11111111-1111-1111-1111-111111111105', 'Ahmedabad Airport Hub (SVPI)', 'Ahmedabad', 'Airport Road, Near Terminal 1 / 2 Arrivals, Hansol', 'Sardar Vallabhbhai Patel International Airport', '+91 98765 43214', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address,
  landmark = EXCLUDED.landmark,
  contact_phone = EXCLUDED.contact_phone,
  is_active = EXCLUDED.is_active;

-- NOTE:
-- All dummy vehicles have been removed.
-- Real vehicle inventory will be created directly by the fleet manager via the Admin Operations Portal (/admin/login).
