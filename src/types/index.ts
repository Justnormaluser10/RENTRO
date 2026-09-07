export type VehicleType = 'car' | 'bike';

export type VehicleCategory = 
  | 'hatchback' 
  | 'sedan' 
  | 'suv' 
  | 'cruiser' 
  | 'scooter' 
  | 'sport' 
  | 'electric';

export type FuelType = 'petrol' | 'diesel' | 'electric' | 'cng';

export type TransmissionType = 'manual' | 'automatic';

export type VehicleStatus = 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'UNAVAILABLE';

export type BookingStatus = 
  | 'PENDING' 
  | 'PAYMENT_PENDING' 
  | 'CONFIRMED' 
  | 'ACTIVE' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type KYCStatus = 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type UserRole = 'customer' | 'admin';

export interface Location {
  id: string;
  name: string;
  city: string;
  address: string;
  landmark?: string;
  contact_phone?: string;
  is_active: boolean;
}

export interface VehiclePricing {
  vehicle_id: string;
  hourly_rate: number;
  six_hour_rate: number;
  daily_rate: number;
  weekly_rate: number;
  security_deposit: number;
  tax_rate_percent: number;
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  registration_number: string;
  type: VehicleType;
  category: VehicleCategory;
  year: number;
  fuel: FuelType;
  transmission: TransmissionType;
  seats: number;
  description: string;
  features: string[];
  location_id?: string;
  status: VehicleStatus;
  rating: number;
  review_count: number;
  created_at?: string;
  pricing: VehiclePricing;
  images: VehicleImage[];
  location?: Location;
}

export interface KYCDocument {
  id: string;
  user_id: string;
  document_type: 'driving_licence' | 'identity_card';
  document_url: string;
  document_back_url?: string;
  document_number?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
}

export interface Inspection {
  id: string;
  booking_id: string;
  type: 'PICKUP' | 'RETURN';
  odometer_reading: number;
  fuel_level: number; // 0 to 100%
  condition_notes?: string;
  photo_urls: string[];
  damage_charges: number;
  late_fee: number;
  extra_charges: number;
  recorded_by?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  currency: string;
  provider: 'razorpay' | 'test_mode';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  status: 'INITIATED' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  user_id: string;
  vehicle_id: string;
  pickup_location_id: string;
  return_location_id: string;
  start_date: string;
  end_date: string;
  duration_hours: number;
  base_amount: number;
  deposit_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: BookingStatus;
  cancellation_reason?: string;
  refund_amount?: number;
  created_at: string;
  updated_at?: string;
  // Joins
  vehicle?: Vehicle;
  pickup_location?: Location;
  return_location?: Location;
  customer?: UserProfile;
  inspection_pickup?: Inspection;
  inspection_return?: Inspection;
  payment?: Payment;
}

export interface Review {
  id: string;
  booking_id: string;
  vehicle_id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_moderated: boolean;
  created_at: string;
  user_name?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  dob?: string;
  address?: string;
  avatar_url?: string;
  kyc_status: KYCStatus;
  created_at?: string;
}

export interface PricingBreakdown {
  durationHours: number;
  durationFormatted: string;
  baseRental: number;
  securityDeposit: number;
  taxAmount: number;
  discountAmount: number;
  totalPayable: number;
  rateAppliedDescription: string;
}

export interface SearchFilterState {
  type: 'all' | 'car' | 'bike';
  pickupLocationId: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
}
