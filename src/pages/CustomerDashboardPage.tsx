import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Booking, BookingStatus } from '../types';
import { formatCurrency, formatDateTime } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Star, 
  Printer
} from 'lucide-react';

interface CustomerDashboardPageProps {
  onBrowseVehicles: () => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({ onBrowseVehicles }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'completed' | 'cancelled'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);

  // Selected Booking Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Cancellation Modal
  const [cancellationBooking, setCancellationBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of personal travel plans');
  const [isCancelling, setIsCancelling] = useState(false);

  // Review Modal
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    const data = await apiService.getBookings(user?.id || 'usr-customer-1', 'customer');
    setBookings(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.id]);

  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const activeBookings = bookings.filter(b => b.status === 'ACTIVE');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED');

  const getFilteredList = () => {
    switch (activeTab) {
      case 'upcoming': return upcomingBookings;
      case 'active': return activeBookings;
      case 'completed': return completedBookings;
      case 'cancelled': return cancelledBookings;
    }
  };

  const handleCancelSubmit = async () => {
    if (!cancellationBooking) return;
    setIsCancelling(true);
    const result = await apiService.cancelBooking(cancellationBooking.id, cancelReason);
    setIsCancelling(false);
    if (result.success) {
      setCancellationBooking(null);
      await fetchBookings();
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewBooking(null);
      setReviewSubmitted(false);
      setReviewComment('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white py-10 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Customer Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0e111a] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl mb-8">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user?.full_name}
              className="w-16 h-16 rounded-2xl object-cover border border-white/15"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {user?.full_name || 'Rahul Sharma'}
                </h1>
                <Badge variant="success" size="sm">KYC Approved</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {user?.email || 'rahul@example.com'} • {user?.phone || '+91 98450 12345'}
              </p>
            </div>
          </div>

          <button
            onClick={onBrowseVehicles}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 transition-all shadow-md shadow-[#00f2aa]/20 self-start sm:self-auto cursor-pointer"
          >
            Book Another Ride
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-px mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'upcoming'
                ? 'border-[#00f2aa] text-[#00f2aa]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Upcoming Reservations ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'active'
                ? 'border-[#00f2aa] text-[#00f2aa]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Active Rental ({activeBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'completed'
                ? 'border-[#00f2aa] text-[#00f2aa]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Past Bookings ({completedBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cancelled'
                ? 'border-[#00f2aa] text-[#00f2aa]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Cancelled ({cancelledBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 rounded-3xl bg-[#0e111a] border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : getFilteredList().length === 0 ? (
          <div className="bg-[#0e111a] rounded-3xl border border-white/10 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Calendar className="w-6 h-6 text-[#00f2aa]" />
            </div>
            <h3 className="text-base font-bold text-white">No {activeTab} bookings found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
              Ready for your next journey across Ahmedabad? Browse our self-drive car and bike collection now.
            </p>
            <button
              onClick={onBrowseVehicles}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 cursor-pointer shadow-lg shadow-[#00f2aa]/20"
            >
              Browse Vehicles
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredList().map((booking) => {
              const statusVariant = 
                booking.status === 'CONFIRMED' ? 'success' :
                booking.status === 'ACTIVE' ? 'info' :
                booking.status === 'COMPLETED' ? 'neutral' : 'danger';

              return (
                <div
                  key={booking.id}
                  className="bg-[#0e111a] rounded-3xl p-5 sm:p-6 border border-white/10 shadow-lg hover:border-[#00f2aa]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left Vehicle & Booking Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={booking.vehicle?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80'}
                      alt={booking.vehicle?.model}
                      className="w-20 h-16 rounded-2xl object-cover border border-white/10 shrink-0"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={statusVariant} size="sm">
                          {booking.status}
                        </Badge>
                        <span className="text-xs font-mono font-bold text-[#00f2aa]">
                          {booking.booking_number}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">
                        {booking.vehicle?.brand} {booking.vehicle?.model}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="capitalize">{booking.vehicle?.transmission}</span>
                        <span>•</span>
                        <span>{booking.duration_hours} Hours</span>
                        <span>•</span>
                        <span className="text-slate-200 font-semibold">{booking.pickup_location?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="grid grid-cols-2 gap-4 text-xs py-2 md:py-0 border-y md:border-y-0 border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Pickup</span>
                      <span className="font-semibold text-white block">{formatDateTime(booking.start_date)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Return</span>
                      <span className="font-semibold text-white block">{formatDateTime(booking.end_date)}</span>
                    </div>
                  </div>

                  {/* Financial Breakdown & Actions */}
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-3 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-500 block leading-none">Paid Total</span>
                      <span className="text-lg font-black text-white block mt-0.5">
                        {formatCurrency(booking.total_amount)}
                      </span>
                      <span className="text-[10px] text-[#00f2aa] font-medium block">
                        Deposit: {formatCurrency(booking.deposit_amount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                      >
                        Details / Receipt
                      </button>

                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => setCancellationBooking(booking)}
                          className="px-3 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}

                      {booking.status === 'COMPLETED' && (
                        <button
                          onClick={() => setReviewBooking(booking)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>Review</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Details & Invoice Modal */}
      {selectedBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBooking(null)}
          title={`Booking ${selectedBooking.booking_number}`}
          description={`Self-Drive Rental: ${selectedBooking.vehicle?.brand} ${selectedBooking.vehicle?.model}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Status Strip */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#141824] border border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block">Current Status</span>
                <span className="font-bold text-white">{selectedBooking.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block">KYC Verification</span>
                <span className="font-bold text-[#00f2aa]">Approved</span>
              </div>
              <div>
                <span className="text-slate-400 block">Payment</span>
                <span className="font-bold text-[#00f2aa]">Success (Online)</span>
              </div>
            </div>

            {/* Handover & Return Inspection Log if active or completed */}
            {selectedBooking.inspection_pickup && (
              <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 text-xs space-y-1">
                <span className="font-bold text-white block">Pickup Inspection Log</span>
                <p className="text-slate-300">
                  Odometer: {selectedBooking.inspection_pickup.odometer_reading} km • Fuel: {selectedBooking.inspection_pickup.fuel_level}%
                </p>
                <p className="text-slate-400 italic">"{selectedBooking.inspection_pickup.condition_notes}"</p>
              </div>
            )}

            {selectedBooking.inspection_return && (
              <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 text-xs space-y-1">
                <span className="font-bold text-white block">Return Inspection Log</span>
                <p className="text-slate-300">
                  Odometer: {selectedBooking.inspection_return.odometer_reading} km • Fuel: {selectedBooking.inspection_return.fuel_level}%
                </p>
                <p className="text-slate-400 italic">"{selectedBooking.inspection_return.condition_notes}"</p>
              </div>
            )}

            {/* Invoice Breakdown */}
            <div className="space-y-2 text-xs border border-white/10 rounded-2xl p-4 bg-[#141824]/50">
              <div className="flex justify-between text-slate-300">
                <span>Rental Charge ({selectedBooking.duration_hours} hrs)</span>
                <span className="font-semibold text-white">{formatCurrency(selectedBooking.base_amount)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Refundable Security Deposit</span>
                <span className="font-semibold text-white">{formatCurrency(selectedBooking.deposit_amount)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>GST Tax (18%)</span>
                <span className="font-semibold text-white">{formatCurrency(selectedBooking.tax_amount)}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-black text-sm text-white">
                <span>Total Payable / Paid</span>
                <span className="text-[#00f2aa] text-base">{formatCurrency(selectedBooking.total_amount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2 rounded-xl text-xs font-black bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancellationBooking && (
        <Modal
          isOpen={true}
          onClose={() => setCancellationBooking(null)}
          title="Cancel Reservation"
          description={`Booking ${cancellationBooking.booking_number}`}
        >
          <div className="space-y-4">
            <div className="rounded-2xl bg-amber-950/40 border border-amber-800/60 p-4 text-xs text-amber-200 space-y-2">
              <div className="font-bold">Transparent Refund Calculation:</div>
              <div className="flex justify-between">
                <span>Security Deposit Refund:</span>
                <span className="font-bold text-white">{formatCurrency(cancellationBooking.deposit_amount)} (100%)</span>
              </div>
              <div className="flex justify-between">
                <span>Base Fare Refund:</span>
                <span className="font-bold text-white">{formatCurrency(Math.round(cancellationBooking.base_amount * 0.9))} (90%)</span>
              </div>
              <div className="pt-2 border-t border-amber-800/60 flex justify-between font-bold text-white">
                <span>Estimated Total Refund:</span>
                <span className="text-[#00f2aa] text-sm">
                  {formatCurrency(Math.round(cancellationBooking.deposit_amount + (cancellationBooking.base_amount * 0.9)))}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Reason for Cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-white/10 bg-[#141824] text-white"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellationBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                onClick={handleCancelSubmit}
                disabled={isCancelling}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Trip Review Modal */}
      {reviewBooking && (
        <Modal
          isOpen={true}
          onClose={() => setReviewBooking(null)}
          title="Rate Your Self-Drive Experience"
          description={`${reviewBooking.vehicle?.brand} ${reviewBooking.vehicle?.model}`}
        >
          {reviewSubmitted ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle className="w-10 h-10 text-[#00f2aa] mx-auto" />
              <h4 className="font-bold text-white">Thank you for your review!</h4>
              <p className="text-xs text-slate-400">Your feedback helps keep the Rentro fleet community safe and dependable in Ahmedabad.</p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Your Review / Driving Experience
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was the engine performance, cleanliness, and hub pickup experience?"
                  required
                  className="w-full text-xs p-3 rounded-xl border border-white/10 bg-[#141824] text-white"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 transition-all cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
