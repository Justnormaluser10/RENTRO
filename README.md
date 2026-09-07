# Rentro — Self-Drive Car & Bike Rental Platform (MVP)

> **"Your ride. Your time."**  
> Premium, flexible self-drive car and bike rentals by the hour, day, or week with upfront transparent pricing, digital KYC verification, Razorpay payments, and fleet handover management.

---

## 🚀 Key Highlights & Architecture

- **True Self-Drive Mobility**: Purpose-built for customer-driven rentals (not ride-hailing / chauffeur).
- **Flexible Rental Horizons**: Rent for 1 hour, 6 hours, 1 day, 2 days, multiple days, or 1 week with deterministic pricing curves.
- **Atomic Availability Engine**: Built-in concurrency protection ensuring no vehicle can ever be double-booked for overlapping time slots.
- **Tiered Pricing Engine**: Real-time breakdown of base fare, 100% refundable security deposit, and 18% GST.
- **Digital KYC Verification**: Upload driving licence with secure storage and staff approval workflow before vehicle handover.
- **Razorpay Payments**: Integrated Razorpay checkout with an automatic local dev test simulator when API keys are not supplied.
- **Fleet Operations Portal (`/admin`)**: Distinct, professional fleet manager dashboard with fleet CRUD, pricing matrix configuration, booking handover/inspection logs (odometer, fuel level, damages, late fees), and KYC queue.
- **Zero-Friction Dual Mode**: Runs directly with real Supabase + Razorpay or self-contained out-of-the-box with 5 Ahmedabad mobility hubs and admin-managed real vehicle inventory.

---

## 📁 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Backend / Database**: Supabase PostgreSQL, Row Level Security (RLS), Postgres Functions / RPCs
- **Storage**: Supabase Storage (`kyc-documents` and `inspections` buckets) with local fallback
- **Payments**: Razorpay Checkout SDK + Simulated Test Gateway
- **Design System**: Accessible, responsive, mobile-first design with bottom sticky CTAs and filter drawers

---

## 🗄️ Database Tables (`supabase/schema.sql`)

| Table Name | Description | Key Fields |
|---|---|---|
| `profiles` | User profiles linked to `auth.users` | `id`, `full_name`, `phone`, `role` ('customer' \| 'admin'), `avatar_url` |
| `locations` | Ahmedabad mobility pickup/return hubs | `id`, `name`, `city`, `address`, `contact_phone`, `is_active` |
| `vehicles` | Fleet vehicles managed by Admin | `brand`, `model`, `registration_number`, `type`, `fuel`, `transmission`, `seats`, `status` |
| `vehicle_images`| Multi-angle vehicle photography | `vehicle_id`, `image_url`, `is_primary`, `display_order` |
| `pricing` | Configurable pricing tiers | `hourly_rate`, `six_hour_rate`, `daily_rate`, `weekly_rate`, `security_deposit`, `tax_rate_percent` |
| `bookings` | Customer reservations & status | `booking_number`, `user_id`, `vehicle_id`, `start_date`, `end_date`, `duration_hours`, `status` |
| `payments` | Razorpay payment audit records | `booking_id`, `amount`, `currency`, `provider`, `razorpay_payment_id`, `status` |
| `kyc_documents` | Driver license verification | `user_id`, `document_type`, `document_url`, `document_number`, `status`, `admin_notes` |
| `inspections` | Fleet handover & return records | `booking_id`, `type` ('PICKUP' \| 'RETURN'), `odometer_reading`, `fuel_level`, `late_fee`, `damage_charges` |
| `reviews` | Customer ratings & feedback | `booking_id`, `vehicle_id`, `rating` (1-5), `comment`, `is_moderated` |

### Database Functions & Atomic Locking
- `check_vehicle_availability(p_vehicle_id, p_start_date, p_end_date)`: Validates overlapping intervals across active bookings (`CONFIRMED`, `ACTIVE`, `PAYMENT_PENDING`).
- `create_booking_atomic(...)`: Uses `SELECT ... FROM vehicles WHERE id = p_vehicle_id FOR UPDATE` row-locking to serialize concurrent booking attempts and guarantee zero overlapping reservations.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```bash
# Supabase Database & Auth (Leave blank to use pre-seeded local storage mode)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Razorpay Payments (Leave blank to use Rentro Test Payment Simulator)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

---

## 🛠️ How to Run the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🧪 Testing Workflows Built-In

### 1. Customer Self-Drive Journey
1. Open Homepage → Choose pickup hub (SG Highway, Prahlad Nagar, Vastrapur, Navrangpura, or SVPI Airport).
2. Select duration pill (`1h`, `6h`, `1d`, `2d`, `1 week`) or custom dates/times.
3. Browse catalog of verified vehicles with responsive filters (Car/Bike, Fuel, Transmission, Seats, Price).
4. Click **View Details** on any vehicle.
5. Review transparent pricing breakdown (Base Rental + Refundable Deposit + 18% GST).
6. Click **Book Now** → Fill driver details & upload Driving Licence.
7. Click **Pay & Confirm** → Complete payment in test mode or with Razorpay.
8. Receive **Booking Confirmation** with booking number, pickup instructions, and downloadable invoice receipt.
9. Track reservation under **My Bookings** (`/dashboard`).

### 2. Overlapping Booking Conflict Prevention
1. Book vehicle `A` from 10:00 AM to 6:00 PM tomorrow.
2. Attempt to book vehicle `A` again for an overlapping slot (e.g., 2:00 PM to 8:00 PM).
3. The platform displays: *"This vehicle is already booked for the selected schedule"* and suggests available alternatives.

### 3. Admin Operations Journey
1. Navigate to `/admin/login` and authenticate using secure password `RENTRO10`.
2. **Dashboard Overview**: View active rentals, today's pickups, platform revenue, and pending KYC badges.
3. **Vehicles & Pricing**: Add new real inventory, adjust hourly/6-hour/daily/weekly rates, or toggle vehicle maintenance mode.
4. **KYC Queue**: Inspect customer driving licences and click **Approve** or **Reject**.
5. **Bookings & Fleet Inspections**:
   - At pickup: Click **Log Pickup** → record odometer reading, fuel %, and condition notes → marks booking `ACTIVE`.
   - At return: Click **Log Return** → record return odometer, fuel %, and optional late fees or damage charges → marks booking `COMPLETED`.

---

## 📋 Production Readiness Checklist Before Accepting Real Payments

1. **Supabase Configuration**:
   - Create a project on [Supabase](https://supabase.com/).
   - Execute `supabase/schema.sql` in the Supabase SQL Editor.
   - Execute `supabase/seed.sql` to populate initial vehicles and hubs.
   - Create a storage bucket named `kyc-documents` with authenticated upload policies.
   - Copy `Project URL` and `anon key` to `.env`.
2. **Razorpay Live Configuration**:
   - Obtain Razorpay live API credentials from [Razorpay Dashboard](https://dashboard.razorpay.com/).
   - Set `VITE_RAZORPAY_KEY_ID=rzp_live_...` in `.env`.
   - Set up server-side webhook endpoint to handle asynchronous payment capture.
