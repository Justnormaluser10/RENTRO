import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Vehicle, 
  Location, 
  Booking, 
  KYCDocument, 
  Inspection, 
  BookingStatus,
  PricingBreakdown
} from '../types';
import { 
  INITIAL_LOCATIONS, 
  INITIAL_VEHICLES, 
  INITIAL_BOOKINGS, 
  INITIAL_KYC_DOCUMENTS 
} from './mockData';
import { generateBookingNumber, calculateDurationHours } from '../lib/utils';
import { calculateRentalPrice } from '../lib/pricing';

// In-memory / LocalStorage State Keys
const STORAGE_KEYS = {
  VEHICLES: 'rentro_ahmedabad_vehicles',
  LOCATIONS: 'rentro_ahmedabad_locations',
  BOOKINGS: 'rentro_ahmedabad_bookings',
  KYC: 'rentro_ahmedabad_kyc',
  INSPECTIONS: 'rentro_ahmedabad_inspections',
};

// Purge any legacy demo data from previous sessions
try {
  const legacyVehicles = localStorage.getItem('rentro_vehicles');
  if (legacyVehicles && legacyVehicles.includes('v-car-1')) {
    localStorage.removeItem('rentro_vehicles');
  }
} catch {
  // ignore
}

function getLocalData<T>(key: string, defaultData: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(saved) as T;
  } catch {
    return defaultData;
  }
}

function setLocalData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to save to localStorage key "${key}":`, err);
  }
}

export const apiService = {
  // -------------------------------------------------------------
  // LOCATIONS
  // -------------------------------------------------------------
  async getLocations(): Promise<Location[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .eq('is_active', true);
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getLocations error, falling back to local:', err);
      }
    }
    return getLocalData<Location[]>(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
  },

  // -------------------------------------------------------------
  // VEHICLES
  // -------------------------------------------------------------
  async getVehicles(filter?: {
    type?: 'all' | 'car' | 'bike';
    locationId?: string;
    searchQuery?: string;
    fuel?: string;
    transmission?: string;
    category?: string;
    sortBy?: 'recommended' | 'price_low' | 'price_high' | 'rating';
  }): Promise<Vehicle[]> {
    let vehicles: Vehicle[] = [];

    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('vehicles')
          .select(`
            *,
            pricing:pricing(*),
            images:vehicle_images(*),
            location:locations(*)
          `);

        if (filter?.type && filter.type !== 'all') {
          query = query.eq('type', filter.type);
        }
        if (filter?.locationId) {
          query = query.eq('location_id', filter.locationId);
        }

        const { data, error } = await query;
        if (!error && data) {
          vehicles = data;
        }
      } catch (err) {
        console.warn('Supabase getVehicles error, fallback to local:', err);
      }
    }

    if (vehicles.length === 0) {
      vehicles = getLocalData<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    }

    // Attach location objects to local vehicles
    const locations = await this.getLocations();
    vehicles = vehicles.map(v => ({
      ...v,
      location: locations.find(l => l.id === v.location_id) || locations[0],
    }));

    // Filter by type
    if (filter?.type && filter.type !== 'all') {
      vehicles = vehicles.filter(v => v.type === filter.type);
    }

    // Filter by location
    if (filter?.locationId) {
      vehicles = vehicles.filter(v => v.location_id === filter.locationId);
    }

    // Filter by fuel
    if (filter?.fuel && filter.fuel !== 'all') {
      vehicles = vehicles.filter(v => v.fuel === filter.fuel);
    }

    // Filter by transmission
    if (filter?.transmission && filter.transmission !== 'all') {
      vehicles = vehicles.filter(v => v.transmission === filter.transmission);
    }

    // Filter by search query
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      vehicles = vehicles.filter(v => 
        v.brand.toLowerCase().includes(q) || 
        v.model.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (filter?.sortBy === 'price_low') {
      vehicles.sort((a, b) => a.pricing.daily_rate - b.pricing.daily_rate);
    } else if (filter?.sortBy === 'price_high') {
      vehicles.sort((a, b) => b.pricing.daily_rate - a.pricing.daily_rate);
    } else if (filter?.sortBy === 'rating') {
      vehicles.sort((a, b) => b.rating - a.rating);
    }

    return vehicles;
  },

  async getVehicleById(id: string): Promise<Vehicle | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select(`
            *,
            pricing:pricing(*),
            images:vehicle_images(*),
            location:locations(*)
          `)
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getVehicleById error:', err);
      }
    }

    const vehicles = getLocalData<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return null;

    const locations = await this.getLocations();
    return {
      ...vehicle,
      location: locations.find(l => l.id === vehicle.location_id) || locations[0],
    };
  },

  // -------------------------------------------------------------
  // AVAILABILITY ENGINE (Double-booking prevention)
  // -------------------------------------------------------------
  async checkVehicleAvailability(
    vehicleId: string,
    startDate: string,
    endDate: string,
    excludeBookingId?: string
  ): Promise<boolean> {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (isNaN(start) || isNaN(end) || end <= start) {
      return false;
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('check_vehicle_availability', {
          p_vehicle_id: vehicleId,
          p_start_date: startDate,
          p_end_date: endDate,
          p_exclude_booking_id: excludeBookingId || null,
        });
        if (!error && typeof data === 'boolean') {
          return data;
        }
      } catch (err) {
        console.warn('Supabase availability RPC error, fallback to local checks:', err);
      }
    }

    const bookings = getLocalData<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const activeBookings = bookings.filter(b => 
      b.vehicle_id === vehicleId &&
      ['CONFIRMED', 'ACTIVE', 'PAYMENT_PENDING'].includes(b.status) &&
      (!excludeBookingId || b.id !== excludeBookingId)
    );

    const hasOverlap = activeBookings.some(b => {
      const bStart = new Date(b.start_date).getTime();
      const bEnd = new Date(b.end_date).getTime();
      return start < bEnd && end > bStart;
    });

    return !hasOverlap;
  },

  // -------------------------------------------------------------
  // SERVER-SIDE PRICING VALIDATION & ATOMIC BOOKING CREATION
  // -------------------------------------------------------------
  async createBookingAtomic(params: {
    userId: string;
    vehicleId: string;
    pickupLocationId: string;
    returnLocationId: string;
    startDate: string;
    endDate: string;
    paymentMethod: 'razorpay' | 'test_mode';
    razorpayDetails?: {
      orderId?: string;
      paymentId?: string;
      signature?: string;
    };
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    const vehicle = await this.getVehicleById(params.vehicleId);
    if (!vehicle) {
      return { success: false, error: 'Vehicle not found' };
    }

    const durationHours = calculateDurationHours(params.startDate, params.endDate);
    const pricingBreakdown: PricingBreakdown = calculateRentalPrice(vehicle.pricing, durationHours);

    const isAvailable = await this.checkVehicleAvailability(
      params.vehicleId, 
      params.startDate, 
      params.endDate
    );

    if (!isAvailable) {
      return { 
        success: false, 
        error: 'Sorry, this vehicle was just booked by another customer in Ahmedabad for these dates. Please choose another vehicle or time.' 
      };
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('create_booking_atomic', {
          p_user_id: params.userId,
          p_vehicle_id: params.vehicleId,
          p_pickup_location_id: params.pickupLocationId,
          p_return_location_id: params.returnLocationId,
          p_start_date: params.startDate,
          p_end_date: params.endDate,
          p_base_amount: pricingBreakdown.baseRental,
          p_deposit_amount: pricingBreakdown.securityDeposit,
          p_tax_amount: pricingBreakdown.taxAmount,
          p_total_amount: pricingBreakdown.totalPayable,
        });

        if (!error && data?.success) {
          const newBooking: Booking = {
            id: data.booking_id,
            booking_number: data.booking_number,
            user_id: params.userId,
            vehicle_id: params.vehicleId,
            pickup_location_id: params.pickupLocationId,
            return_location_id: params.returnLocationId,
            start_date: params.startDate,
            end_date: params.endDate,
            duration_hours: durationHours,
            base_amount: pricingBreakdown.baseRental,
            deposit_amount: pricingBreakdown.securityDeposit,
            tax_amount: pricingBreakdown.taxAmount,
            discount_amount: 0,
            total_amount: pricingBreakdown.totalPayable,
            status: 'CONFIRMED',
            created_at: new Date().toISOString(),
            vehicle,
          };
          return { success: true, booking: newBooking };
        } else if (data && !data.success) {
          return { success: false, error: data.error };
        }
      } catch (err) {
        console.warn('Supabase create_booking_atomic RPC failed, continuing to local store:', err);
      }
    }

    const bookings = getLocalData<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const locations = await this.getLocations();

    const newBooking: Booking = {
      id: 'bkg-' + Date.now().toString(36),
      booking_number: generateBookingNumber(),
      user_id: params.userId,
      vehicle_id: params.vehicleId,
      pickup_location_id: params.pickupLocationId,
      return_location_id: params.returnLocationId,
      start_date: params.startDate,
      end_date: params.endDate,
      duration_hours: durationHours,
      base_amount: pricingBreakdown.baseRental,
      deposit_amount: pricingBreakdown.securityDeposit,
      tax_amount: pricingBreakdown.taxAmount,
      discount_amount: 0,
      total_amount: pricingBreakdown.totalPayable,
      status: 'CONFIRMED',
      created_at: new Date().toISOString(),
      vehicle,
      pickup_location: locations.find(l => l.id === params.pickupLocationId),
      return_location: locations.find(l => l.id === params.returnLocationId),
      customer: {
        id: params.userId,
        full_name: params.customerName || 'Hardik Patel',
        email: params.customerEmail || 'customer@example.com',
        phone: params.customerPhone || '+91 98250 12345',
        role: 'customer',
        kyc_status: 'APPROVED',
      },
      payment: {
        id: 'pay-' + Date.now(),
        booking_id: '',
        user_id: params.userId,
        amount: pricingBreakdown.totalPayable,
        currency: 'INR',
        provider: params.paymentMethod,
        razorpay_order_id: params.razorpayDetails?.orderId,
        razorpay_payment_id: params.razorpayDetails?.paymentId || 'pay_sim_' + Math.random().toString(36).substring(2, 9),
        razorpay_signature: params.razorpayDetails?.signature,
        status: 'SUCCESS',
        created_at: new Date().toISOString(),
      },
    };

    if (newBooking.payment) {
      newBooking.payment.booking_id = newBooking.id;
    }

    bookings.unshift(newBooking);
    setLocalData(STORAGE_KEYS.BOOKINGS, bookings);

    return { success: true, booking: newBooking };
  },

  // -------------------------------------------------------------
  // BOOKINGS MANAGEMENT
  // -------------------------------------------------------------
  async getBookings(userId?: string, role: 'customer' | 'admin' = 'customer'): Promise<Booking[]> {
    let bookings = getLocalData<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const vehicles = await this.getVehicles();
    const locations = await this.getLocations();

    bookings = bookings.map(b => ({
      ...b,
      vehicle: vehicles.find(v => v.id === b.vehicle_id) || b.vehicle,
      pickup_location: locations.find(l => l.id === b.pickup_location_id) || locations[0],
      return_location: locations.find(l => l.id === b.return_location_id) || locations[0],
    }));

    if (role === 'admin') {
      return bookings;
    }

    if (userId) {
      return bookings.filter(b => b.user_id === userId);
    }

    return bookings;
  },

  async getBookingById(id: string): Promise<Booking | null> {
    const bookings = await this.getBookings(undefined, 'admin');
    return bookings.find(b => b.id === id || b.booking_number === id) || null;
  },

  async cancelBooking(bookingId: string, reason: string): Promise<{ success: boolean; refundAmount: number; error?: string }> {
    const bookings = getLocalData<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) {
      return { success: false, refundAmount: 0, error: 'Booking not found' };
    }

    const booking = bookings[index];
    if (['COMPLETED', 'CANCELLED', 'ACTIVE'].includes(booking.status)) {
      return { success: false, refundAmount: 0, error: `Cannot cancel booking in ${booking.status} status.` };
    }

    const refundAmount = Math.round(booking.deposit_amount + (booking.base_amount * 0.9));

    booking.status = 'CANCELLED';
    booking.cancellation_reason = reason;
    booking.refund_amount = refundAmount;
    booking.updated_at = new Date().toISOString();

    bookings[index] = booking;
    setLocalData(STORAGE_KEYS.BOOKINGS, bookings);

    return { success: true, refundAmount };
  },

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<boolean> {
    const bookings = getLocalData<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) return false;

    bookings[index].status = status;
    bookings[index].updated_at = new Date().toISOString();
    setLocalData(STORAGE_KEYS.BOOKINGS, bookings);
    return true;
  },

  // -------------------------------------------------------------
  // FLEET INSPECTION (Pickup & Return)
  // -------------------------------------------------------------
  async recordInspection(inspection: Inspection): Promise<boolean> {
    const bookings = getLocalData<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const bIndex = bookings.findIndex(b => b.id === inspection.booking_id);
    if (bIndex === -1) return false;

    const booking = bookings[bIndex];

    if (inspection.type === 'PICKUP') {
      booking.inspection_pickup = inspection;
      booking.status = 'ACTIVE';
    } else if (inspection.type === 'RETURN') {
      booking.inspection_return = inspection;
      booking.status = 'COMPLETED';

      const extraTotal = (inspection.damage_charges || 0) + (inspection.late_fee || 0) + (inspection.extra_charges || 0);
      if (extraTotal > 0) {
        booking.total_amount += extraTotal;
      }
    }

    bookings[bIndex] = booking;
    setLocalData(STORAGE_KEYS.BOOKINGS, bookings);
    return true;
  },

  // -------------------------------------------------------------
  // KYC DOCUMENTS
  // -------------------------------------------------------------
  async getKYCDocuments(userId?: string): Promise<KYCDocument[]> {
    const docs = getLocalData<KYCDocument[]>(STORAGE_KEYS.KYC, INITIAL_KYC_DOCUMENTS);
    if (userId) {
      return docs.filter(d => d.user_id === userId);
    }
    return docs;
  },

  async submitKYCDocument(doc: Omit<KYCDocument, 'id' | 'created_at' | 'status'>): Promise<KYCDocument> {
    const docs = getLocalData<KYCDocument[]>(STORAGE_KEYS.KYC, INITIAL_KYC_DOCUMENTS);
    const newDoc: KYCDocument = {
      ...doc,
      id: 'kyc-' + Date.now().toString(36),
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    docs.unshift(newDoc);
    setLocalData(STORAGE_KEYS.KYC, docs);
    return newDoc;
  },

  async reviewKYCDocument(
    kycId: string, 
    status: 'APPROVED' | 'REJECTED', 
    notes?: string,
    adminId?: string
  ): Promise<boolean> {
    const docs = getLocalData<KYCDocument[]>(STORAGE_KEYS.KYC, INITIAL_KYC_DOCUMENTS);
    const index = docs.findIndex(d => d.id === kycId);
    if (index === -1) return false;

    docs[index].status = status;
    docs[index].admin_notes = notes;
    docs[index].reviewed_by = adminId || 'admin';
    docs[index].reviewed_at = new Date().toISOString();

    setLocalData(STORAGE_KEYS.KYC, docs);
    return true;
  },

  // -------------------------------------------------------------
  // ADMIN VEHICLE CRUD (Real inventory managed by Admin)
  // -------------------------------------------------------------
  async adminSaveVehicle(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const vehicles = getLocalData<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);

    if (vehicleData.id) {
      const index = vehicles.findIndex(v => v.id === vehicleData.id);
      if (index !== -1) {
        vehicles[index] = { ...vehicles[index], ...vehicleData } as Vehicle;
        setLocalData(STORAGE_KEYS.VEHICLES, vehicles);
        return vehicles[index];
      }
    }

    // Insert new vehicle with Gujarat Ahmedabad registration format (GJ 01 or GJ 27)
    const newVehicle: Vehicle = {
      id: 'v-' + vehicleData.type + '-' + Date.now().toString(36),
      brand: vehicleData.brand || 'Brand',
      model: vehicleData.model || 'Model',
      registration_number: vehicleData.registration_number || `GJ 01 ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(1000 + Math.random() * 8999)}`,
      type: vehicleData.type || 'car',
      category: vehicleData.category || 'suv',
      year: vehicleData.year || 2024,
      fuel: vehicleData.fuel || 'petrol',
      transmission: vehicleData.transmission || 'automatic',
      seats: vehicleData.seats || (vehicleData.type === 'bike' ? 2 : 5),
      description: vehicleData.description || 'Verified Ahmedabad self-drive vehicle maintained to the highest safety and sanitization standards.',
      features: vehicleData.features || ['Air Conditioning', 'Bluetooth Audio', 'Fastag Enabled', 'ABS & Airbags'],
      location_id: vehicleData.location_id || 'ahmedabad-sg-highway',
      status: vehicleData.status || 'AVAILABLE',
      rating: 5.0,
      review_count: 0,
      pricing: vehicleData.pricing || {
        vehicle_id: '',
        hourly_rate: 250,
        six_hour_rate: 1000,
        daily_rate: 1800,
        weekly_rate: 9500,
        security_deposit: 3000,
        tax_rate_percent: 18,
      },
      images: vehicleData.images && vehicleData.images.length > 0 ? vehicleData.images : [
        {
          id: 'img-' + Date.now(),
          vehicle_id: '',
          image_url: vehicleData.type === 'car'
            ? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80'
            : 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
          is_primary: true,
          display_order: 1,
        }
      ]
    };

    newVehicle.pricing.vehicle_id = newVehicle.id;
    vehicles.unshift(newVehicle);
    setLocalData(STORAGE_KEYS.VEHICLES, vehicles);
    return newVehicle;
  },

  async adminDeleteVehicle(vehicleId: string): Promise<boolean> {
    const vehicles = getLocalData<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    const filtered = vehicles.filter(v => v.id !== vehicleId);
    setLocalData(STORAGE_KEYS.VEHICLES, filtered);
    return true;
  }
};
