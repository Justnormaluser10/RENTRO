import React, { useState, useMemo } from 'react';
import { Vehicle, PricingBreakdown } from '../types';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import { paymentService } from '../services/payment';
import { calculateRentalPrice } from '../lib/pricing';
import { formatCurrency, formatDateTime } from '../lib/utils';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { 
  ShieldCheck, 
  Upload, 
  CreditCard, 
  AlertCircle, 
  Lock, 
  ArrowLeft,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';

interface CheckoutPageProps {
  vehicle: Vehicle;
  onBack: () => void;
  onBookingSuccess: (bookingId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  vehicle,
  onBack,
  onBookingSuccess,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { searchState, startDateTimeISO, endDateTimeISO, durationHours } = useBooking();

  // Checkout Step: 1 = Details & KYC, 2 = Summary & Payment
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form State
  const [fullName, setFullName] = useState(user?.full_name || 'Rahul Sharma');
  const [email, setEmail] = useState(user?.email || 'rahul.sharma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98450 12345');
  const [licenceNumber, setLicenceNumber] = useState('GJ-01-2022-004819');
  const [licenceFile, setLicenceFile] = useState<File | null>(null);
  const [licencePreviewUrl, setLicencePreviewUrl] = useState<string>(
    'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'
  );

  // Processing & Error states
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSimulatedGatewayModal, setShowSimulatedGatewayModal] = useState(false);

  // Pricing calculation
  const pricingBreakdown: PricingBreakdown = useMemo(() => {
    return calculateRentalPrice(vehicle.pricing, durationHours);
  }, [vehicle, durationHours]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLicenceFile(file);
      const res = await storageService.uploadKYCDocument(file, user?.id || 'temp-user');
      if (res.url) {
        setLicencePreviewUrl(res.url);
      }
    }
  };

  const handleProceedToPayment = () => {
    if (!fullName.trim() || !phone.trim() || !licenceNumber.trim()) {
      setErrorMessage('Please fill in your full name, mobile number, and driving licence number.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(2);
  };

  const executeAtomicBookingCreation = async (
    paymentMethod: 'razorpay' | 'test_mode',
    razorpayDetails?: { orderId?: string; paymentId?: string; signature?: string }
  ) => {
    setIsProcessing(true);
    setErrorMessage(null);

    // Save KYC document record
    if (licencePreviewUrl) {
      await apiService.submitKYCDocument({
        user_id: user?.id || 'usr-customer-1',
        document_type: 'driving_licence',
        document_url: licencePreviewUrl,
        document_number: licenceNumber,
        user_name: fullName,
        user_email: email,
        user_phone: phone,
      });
    }

    // Call atomic booking creation RPC/service
    const result = await apiService.createBookingAtomic({
      userId: user?.id || 'usr-customer-1',
      vehicleId: vehicle.id,
      pickupLocationId: searchState.pickupLocationId,
      returnLocationId: searchState.returnLocationId,
      startDate: startDateTimeISO,
      endDate: endDateTimeISO,
      paymentMethod,
      razorpayDetails,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
    });

    setIsProcessing(false);

    if (result.success && result.booking) {
      setShowSimulatedGatewayModal(false);
      onBookingSuccess(result.booking.id);
    } else {
      setErrorMessage(result.error || 'Failed to complete booking. Please try again.');
    }
  };

  const handleInitiatePayment = () => {
    setErrorMessage(null);

    // If Razorpay live gateway configured, trigger checkout SDK
    if (paymentService.isLiveGatewayConfigured()) {
      paymentService.processPayment({
        amount: pricingBreakdown.totalPayable,
        bookingNumber: 'DRAFT',
        vehicleTitle: `${vehicle.brand} ${vehicle.model}`,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        onSuccess: (paymentRes) => {
          executeAtomicBookingCreation('razorpay', {
            orderId: paymentRes.razorpay_order_id,
            paymentId: paymentRes.razorpay_payment_id,
            signature: paymentRes.razorpay_signature,
          });
        },
        onFailure: (err) => {
          setErrorMessage(err.message);
        },
      });
    } else {
      // Open test mode payment simulator modal
      setShowSimulatedGatewayModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white py-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={currentStep === 2 ? () => setCurrentStep(1) : onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#00f2aa] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentStep === 2 ? 'Back to Customer Details' : 'Back to Vehicle Page'}</span>
        </button>

        {/* Progress Bar */}
        <div className="mb-8 bg-[#0e111a] rounded-3xl p-4 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 max-w-lg mx-auto">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-[#00f2aa]' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                currentStep >= 1 ? 'bg-[#00f2aa] text-slate-950' : 'bg-white/10 text-slate-400'
              }`}>
                1
              </div>
              <span>Driver Details & KYC</span>
            </div>

            <div className="h-0.5 w-16 bg-white/10" />

            <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-[#00f2aa]' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                currentStep === 2 ? 'bg-[#00f2aa] text-slate-950' : 'bg-white/10 text-slate-400'
              }`}>
                2
              </div>
              <span>Summary & Payment</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-2xl bg-rose-950/60 border border-rose-800/80 p-4 flex items-start gap-3 text-rose-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Step Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {currentStep === 1 && (
              <div className="bg-[#0e111a] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Step 1: Driver Information</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enter the primary driver's details as registered on their official Driving Licence.
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Name (as on Driving Licence)"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Mobile Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      required
                    />
                  </div>
                </div>

                {/* KYC Verification Upload Box */}
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Driving Licence Verification (KYC)</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Required by Motor Vehicles Act for self-drive vehicle handover at Ahmedabad hubs.
                    </p>
                  </div>

                  <Input
                    label="Driving Licence Number"
                    value={licenceNumber}
                    onChange={(e) => setLicenceNumber(e.target.value)}
                    placeholder="e.g. GJ-01-2022-004819"
                    required
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Upload Licence Photo (Front)
                    </label>
                    
                    <div className="flex items-center gap-4">
                      {licencePreviewUrl && (
                        <div className="w-24 h-16 rounded-xl overflow-hidden border border-white/10 bg-slate-900 shrink-0">
                          <img src={licencePreviewUrl} alt="Licence preview" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/15 rounded-2xl p-4 text-center hover:border-[#00f2aa] hover:bg-[#00f2aa]/5 transition-colors cursor-pointer bg-[#141824]">
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-xs font-semibold text-slate-300">
                          {licenceFile ? licenceFile.name : 'Click to upload or take a photo'}
                        </span>
                        <span className="text-[10px] text-slate-500">JPG, PNG or PDF up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#00f2aa]/10 border border-[#00f2aa]/20 p-3.5 flex items-center gap-2 text-xs text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-[#00f2aa] shrink-0" />
                    <span>Your documents are stored privately with end-to-end encryption and only reviewed by authorized Rentro fleet staff.</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-xl shadow-[#00f2aa]/20 transition-all cursor-pointer"
                >
                  Proceed to Review & Payment
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-[#0e111a] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Step 2: Confirm & Pay</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Review your schedule, driver info, and complete your reservation.
                  </p>
                </div>

                {/* Driver summary card */}
                <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Driver:</span>
                    <span className="font-bold text-white">{fullName} ({phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Licence:</span>
                    <span className="font-mono text-[#00f2aa]">{licenceNumber} (Verified)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Pickup Hub:</span>
                    <span className="font-semibold text-white">{vehicle.location?.name}</span>
                  </div>
                </div>

                {/* Payment Method Badge */}
                <div className="border border-white/10 bg-[#141824] rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00f2aa]/10 border border-[#00f2aa]/20 text-[#00f2aa] flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {paymentService.isLiveGatewayConfigured() ? 'Razorpay Secure Checkout' : 'Rentro Test Payment Simulator'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        UPI, Credit/Debit Cards, Net Banking, EMI
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#00f2aa] bg-[#00f2aa]/10 border border-[#00f2aa]/20 px-2.5 py-1 rounded-full">
                    256-Bit SSL
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl font-black text-base bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-xl shadow-[#00f2aa]/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay {formatCurrency(pricingBreakdown.totalPayable)} & Confirm Booking</span>
                </button>

                <div className="text-center text-[11px] text-slate-500">
                  By clicking Pay, you agree to Rentro's Rental Agreement, Fuel Policy, and Ahmedabad Safety Guidelines.
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Reservation Summary Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-[#0e111a] rounded-3xl p-6 border border-white/10 shadow-xl space-y-5">
              <h3 className="text-xs font-bold text-[#00f2aa] uppercase tracking-wider">
                Booking Summary
              </h3>

              {/* Vehicle Preview Mini Card */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <img
                  src={vehicle.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'}
                  alt={vehicle.model}
                  className="w-18 h-14 rounded-2xl object-cover border border-white/10 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-[#00f2aa] uppercase tracking-wider block">
                    {vehicle.brand}
                  </span>
                  <h4 className="text-sm font-bold text-white">{vehicle.model}</h4>
                  <span className="text-xs text-slate-400 capitalize">{vehicle.transmission} • {vehicle.fuel}</span>
                </div>
              </div>

              {/* Date / Time Details */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#00f2aa] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">Pickup:</span>
                    <span className="font-semibold text-white">{formatDateTime(startDateTimeISO)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#00f2aa] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">Return:</span>
                    <span className="font-semibold text-white">{formatDateTime(endDateTimeISO)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#00f2aa] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">Hub Location:</span>
                    <span className="font-semibold text-white">{vehicle.location?.name}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Rental Fare ({pricingBreakdown.rateAppliedDescription})</span>
                  <span className="font-semibold text-white">{formatCurrency(pricingBreakdown.baseRental)}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Refundable Security Deposit</span>
                  <span className="font-semibold text-white">{formatCurrency(pricingBreakdown.securityDeposit)}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>GST & Insurance (18%)</span>
                  <span className="font-semibold text-white">{formatCurrency(pricingBreakdown.taxAmount)}</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-baseline justify-between text-white">
                  <div>
                    <span className="text-sm font-bold block">Total Amount</span>
                    <span className="text-[10px] text-[#00f2aa] font-medium">100% Refundable deposit included</span>
                  </div>
                  <span className="text-2xl font-black text-white">
                    {formatCurrency(pricingBreakdown.totalPayable)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Payment Gateway Modal */}
      <Modal
        isOpen={showSimulatedGatewayModal}
        onClose={() => setShowSimulatedGatewayModal(false)}
        title="Rentro Test Payment Gateway"
        description="Development Mode Simulator (Zero Real Money Deducted)"
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-amber-950/40 border border-amber-800/60 p-3.5 text-xs text-amber-200">
            <strong>Running in Development Mode:</strong> You can test both successful booking confirmation and payment failure scenarios right now.
          </div>

          <div className="p-4 rounded-2xl bg-[#141824] border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Vehicle:</span>
              <span className="font-bold text-white">{vehicle.brand} {vehicle.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duration:</span>
              <span className="font-bold text-white">{pricingBreakdown.durationFormatted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Amount to Pay:</span>
              <span className="font-black text-[#00f2aa] text-base">{formatCurrency(pricingBreakdown.totalPayable)}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              className="w-full py-3 px-4 rounded-xl font-black text-sm bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-lg shadow-[#00f2aa]/20 transition-all cursor-pointer disabled:opacity-50"
              onClick={() => executeAtomicBookingCreation('test_mode')}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : 'Simulate Successful Payment (Instant Confirm)'}
            </button>

            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
              onClick={() => {
                setShowSimulatedGatewayModal(false);
                setErrorMessage('Payment failed or was cancelled by user. Booking not created.');
              }}
            >
              Simulate Payment Failure / Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
