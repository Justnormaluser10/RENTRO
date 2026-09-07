import React, { useState, useEffect, useMemo } from 'react';
import { Vehicle, PricingBreakdown } from '../types';
import { useBooking } from '../context/BookingContext';
import { apiService } from '../services/api';
import { calculateRentalPrice } from '../lib/pricing';
import { formatCurrency, calculateDurationHours } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Star, 
  Users, 
  Fuel, 
  Gauge, 
  MapPin, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  ArrowLeft, 
  Info,
  MessageCircle,
  Clock
} from 'lucide-react';

interface VehicleDetailPageProps {
  vehicleId: string;
  onBack: () => void;
  onProceedToCheckout: (vehicle: Vehicle) => void;
  onSelectAlternative: (vehicle: Vehicle) => void;
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({
  vehicleId,
  onBack,
  onProceedToCheckout,
  onSelectAlternative,
}) => {
  const { searchState, updateSearch, startDateTimeISO, endDateTimeISO, applyQuickDurationPreset } = useBooking();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [alternatives, setAlternatives] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicle = async () => {
      setIsLoading(true);
      const data = await apiService.getVehicleById(vehicleId);
      setVehicle(data);
      setIsLoading(false);
    };
    fetchVehicle();
  }, [vehicleId]);

  // Check availability whenever dates change
  useEffect(() => {
    if (!vehicle) return;

    let isMounted = true;
    const checkAvailability = async () => {
      setIsCheckingAvailability(true);
      const available = await apiService.checkVehicleAvailability(
        vehicle.id,
        startDateTimeISO,
        endDateTimeISO
      );

      if (isMounted) {
        setIsAvailable(available);
        setIsCheckingAvailability(false);

        // If unavailable, fetch alternative available vehicles of same type
        if (!available) {
          const all = await apiService.getVehicles({ type: vehicle.type });
          const otherAvailable = all.filter(v => v.id !== vehicle.id && v.status === 'AVAILABLE').slice(0, 2);
          setAlternatives(otherAvailable);
        } else {
          setAlternatives([]);
        }
      }
    };

    checkAvailability();

    return () => {
      isMounted = false;
    };
  }, [vehicle, startDateTimeISO, endDateTimeISO]);

  const durationHours = useMemo(() => {
    return calculateDurationHours(startDateTimeISO, endDateTimeISO);
  }, [startDateTimeISO, endDateTimeISO]);

  const pricingBreakdown: PricingBreakdown | null = useMemo(() => {
    if (!vehicle) return null;
    return calculateRentalPrice(vehicle.pricing, durationHours);
  }, [vehicle, durationHours]);

  if (isLoading || !vehicle) {
    return (
      <div className="min-h-screen bg-[#07080c] text-white py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00f2aa]" />
      </div>
    );
  }

  const images = vehicle.images?.length > 0 ? vehicle.images : [
    { id: '1', vehicle_id: vehicle.id, image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', is_primary: true, display_order: 1 }
  ];

  return (
    <div className="min-h-screen bg-[#07080c] text-white py-8 pb-32 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#00f2aa] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all vehicles</span>
        </button>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Gallery & Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-16/10 rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl">
                <img
                  src={images[activeImageIndex]?.image_url || images[0].image_url}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080c]/60 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <Badge variant={isAvailable ? 'success' : 'danger'}>
                    {isAvailable ? 'Available for Selected Schedule' : 'Unavailable for Selected Dates'}
                  </Badge>
                  <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-white uppercase tracking-wider border border-white/10">
                    {vehicle.category}
                  </span>
                </div>
              </div>

              {/* Thumbnail strip if multiple images */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx ? 'border-[#00f2aa] shadow-md shadow-[#00f2aa]/20' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Header & Specs */}
            <div className="bg-[#0e111a] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#00f2aa] uppercase tracking-wider mb-1">
                    <span>{vehicle.brand}</span>
                    <span>•</span>
                    <span>{vehicle.year}</span>
                    <span>•</span>
                    <span className="text-slate-400 font-mono">{vehicle.registration_number}</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {vehicle.model}
                  </h1>
                </div>

                <div className="flex items-center gap-1.5 bg-white/5 px-3.5 py-2 rounded-2xl border border-white/10 self-start">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-white">{vehicle.rating}</span>
                  <span className="text-xs text-slate-400">({vehicle.review_count} ratings)</span>
                </div>
              </div>

              {/* Specs Badge Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 text-center">
                  <Gauge className="w-4 h-4 text-[#00f2aa] mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Transmission</span>
                  <span className="text-xs font-bold text-white capitalize">{vehicle.transmission}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 text-center">
                  <Fuel className="w-4 h-4 text-[#00f2aa] mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Fuel</span>
                  <span className="text-xs font-bold text-white capitalize">{vehicle.fuel}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 text-center">
                  <Users className="w-4 h-4 text-[#00f2aa] mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Capacity</span>
                  <span className="text-xs font-bold text-white">{vehicle.seats} Seater</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 text-center">
                  <MapPin className="w-4 h-4 text-[#00f2aa] mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Hub Location</span>
                  <span className="text-xs font-bold text-white truncate block">
                    {vehicle.location?.name.split(' ')[0] || 'SG Highway'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-[#00f2aa] uppercase tracking-wider mb-2">
                  Vehicle Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {vehicle.description}
                </p>
              </div>

              {/* Features List */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#00f2aa] uppercase tracking-wider mb-3">
                    Key Equipment & Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {vehicle.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                        <div className="w-4 h-4 rounded-full bg-[#00f2aa]/15 text-[#00f2aa] flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rental Rules */}
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-[#00f2aa] uppercase tracking-wider mb-3">
                  Self-Drive Requirements & Guidelines
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f2aa] shrink-0 mt-0.5" />
                    <span><strong>Driver Eligibility:</strong> Minimum 21 years old with valid Indian physical Driving Licence (Digilocker accepted).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f2aa] shrink-0 mt-0.5" />
                    <span><strong>Security Deposit:</strong> 100% refundable upon safe return. Inspected at Ahmedabad hub in under 2 minutes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f2aa] shrink-0 mt-0.5" />
                    <span><strong>Fuel Policy:</strong> Same-to-same fuel level. Pick up full/logged, return at same level.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f2aa] shrink-0 mt-0.5" />
                    <span><strong>100% Self-Drive:</strong> Zero drivers. Complete freedom to explore Ahmedabad and Gujarat on your terms.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Widget (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-[#0e111a] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
              
              <div>
                <span className="text-xs font-bold text-[#00f2aa] uppercase tracking-wider block mb-1">
                  Choose Rental Duration
                </span>
                
                {/* Duration Pills (1h, 6h, 1d, 2d, 3d, 7d) */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {(['1h', '6h', '1d', '2d', '3d', '7d'] as const).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => applyQuickDurationPreset(preset)}
                      className="py-2.5 px-2 text-xs font-bold rounded-xl border border-white/10 bg-[#141824] text-slate-300 hover:bg-[#00f2aa] hover:text-slate-950 hover:border-transparent transition-all cursor-pointer text-center"
                    >
                      {preset === '1h' ? '1 Hour' : preset === '6h' ? '6 Hours' : preset === '1d' ? '1 Day' : preset === '2d' ? '2 Days' : preset === '3d' ? '3 Days' : '1 Week (7d)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date / Time inputs */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Custom Dates & Timing
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400">Pickup Date & Time</span>
                    <input
                      type="date"
                      value={searchState.pickupDate}
                      onChange={(e) => updateSearch({ pickupDate: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-[#141824] text-white"
                    />
                    <input
                      type="time"
                      value={searchState.pickupTime}
                      onChange={(e) => updateSearch({ pickupTime: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-[#141824] text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400">Return Date & Time</span>
                    <input
                      type="date"
                      value={searchState.returnDate}
                      onChange={(e) => updateSearch({ returnDate: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-[#141824] text-white"
                    />
                    <input
                      type="time"
                      value={searchState.returnTime}
                      onChange={(e) => updateSearch({ returnTime: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-[#141824] text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Availability Alert if Conflicted */}
              {!isAvailable && (
                <div className="rounded-2xl bg-rose-950/50 border border-rose-800/80 p-4 space-y-3">
                  <div className="flex items-start gap-2 text-rose-300 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>This vehicle is already reserved for the selected schedule. Please adjust dates or choose an available option below.</span>
                  </div>

                  {alternatives.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-rose-800/60">
                      <span className="text-[11px] font-bold uppercase text-rose-300 block">Available Alternatives:</span>
                      {alternatives.map((alt) => (
                        <div key={alt.id} className="flex items-center justify-between bg-[#0e111a] p-2.5 rounded-xl border border-white/10 text-xs">
                          <div>
                            <span className="font-bold text-white block">{alt.brand} {alt.model}</span>
                            <span className="text-[10px] text-[#00f2aa] font-bold">{formatCurrency(alt.pricing.daily_rate)}/day</span>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => onSelectAlternative(alt)} className="text-xs bg-white/5 border-white/10 text-white">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Breakdown Card */}
              {pricingBreakdown && (
                <div className="rounded-2xl bg-[#141824] p-5 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white pb-2 border-b border-white/5">
                    <span>Pricing Summary</span>
                    <span className="text-[#00f2aa] font-mono">{pricingBreakdown.durationFormatted}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Base Rental ({pricingBreakdown.rateAppliedDescription})</span>
                      <span className="font-bold text-white">{formatCurrency(pricingBreakdown.baseRental)}</span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span className="flex items-center gap-1">
                        Refundable Security Deposit
                        <span title="Returned to source account upon safe check-in"><Info className="w-3 h-3 text-slate-500" /></span>
                      </span>
                      <span className="font-bold text-white">{formatCurrency(pricingBreakdown.securityDeposit)}</span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>GST Taxes & Insurance (18%)</span>
                      <span className="font-bold text-white">{formatCurrency(pricingBreakdown.taxAmount)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Total Payable Now</span>
                      <span className="text-[10px] text-[#00f2aa] font-medium">Includes 100% refundable deposit</span>
                    </div>
                    <span className="text-2xl font-black text-white">
                      {formatCurrency(pricingBreakdown.totalPayable)}
                    </span>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <button
                disabled={!isAvailable || isCheckingAvailability}
                onClick={() => onProceedToCheckout(vehicle)}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base bg-[#00f2aa] hover:bg-[#00d696] disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 shadow-xl shadow-[#00f2aa]/25 transition-all cursor-pointer"
              >
                {isCheckingAvailability ? 'Checking Availability...' : isAvailable ? 'Book Now — Self Drive' : 'Vehicle Unavailable'}
              </button>

              {/* WhatsApp Inquiry Link */}
              <a
                href={`https://wa.me/919876543210?text=Hi%20Rentro,%20I%20am%20interested%20in%20renting%20the%20${encodeURIComponent(vehicle.brand)}%20${encodeURIComponent(vehicle.model)}%20in%20Ahmedabad`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-white/5 hover:bg-white/10 text-white border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#00f2aa]" />
                <span>Book / Inquire via WhatsApp</span>
              </a>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00f2aa]" />
                <span>Instant confirmation • Free cancellation up to 6 hrs prior</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Booking Bottom Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e111a]/95 backdrop-blur-xl border-t border-white/10 p-4 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] text-slate-400 block">Total Payable</span>
          <span className="text-lg font-black text-white">
            {pricingBreakdown ? formatCurrency(pricingBreakdown.totalPayable) : formatCurrency(vehicle.pricing.daily_rate)}
          </span>
        </div>

        <button
          disabled={!isAvailable || isCheckingAvailability}
          onClick={() => onProceedToCheckout(vehicle)}
          className="py-2.5 px-6 rounded-xl font-bold text-xs bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 disabled:opacity-40 cursor-pointer shadow-lg shadow-[#00f2aa]/20"
        >
          {isAvailable ? 'Book Self-Drive' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};
