import React, { useEffect, useState } from 'react';
import { Booking } from '../types';
import { apiService } from '../services/api';
import { formatCurrency, formatDateTime } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Key, 
  Copy,
  Check,
  MessageCircle
} from 'lucide-react';

interface BookingConfirmationPageProps {
  bookingId: string;
  onGoToDashboard: () => void;
  onBrowseVehicles: () => void;
}

export const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({
  bookingId,
  onGoToDashboard,
  onBrowseVehicles,
}) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoading(true);
      const data = await apiService.getBookingById(bookingId);
      setBooking(data);
      setIsLoading(false);
    };
    fetchBooking();
  }, [bookingId]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleCopyDetails = () => {
    if (!booking) return;
    const text = `Rentro Ahmedabad Self-Drive Booking Confirmation:
Booking ID: ${booking.booking_number}
Vehicle: ${booking.vehicle?.brand} ${booking.vehicle?.model} (${booking.vehicle?.registration_number})
Pickup: ${formatDateTime(booking.start_date)}
Return: ${formatDateTime(booking.end_date)}
Hub: ${booking.pickup_location?.name}
Total Paid: ${formatCurrency(booking.total_amount)}
Support: +91 98765 43210`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !booking) {
    return (
      <div className="min-h-screen bg-[#07080c] text-white py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00f2aa]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080c] text-white py-12 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Success Banner */}
        <div className="text-center mb-8 space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#00f2aa]/15 border border-[#00f2aa]/30 text-[#00f2aa] flex items-center justify-center mx-auto shadow-xl shadow-[#00f2aa]/10 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Your self-drive reservation in Ahmedabad is secured. Find your digital voucher and pickup instructions below.
          </p>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-[#141824] px-4 py-2 border border-white/10 text-xs font-mono font-bold text-[#00f2aa]">
            <span>Booking ID: {booking.booking_number}</span>
          </div>
        </div>

        {/* Main Printable Ticket Card */}
        <div className="bg-[#0e111a] rounded-3xl border border-white/15 shadow-2xl overflow-hidden mb-8">
          {/* Header Ticket Strip */}
          <div className="bg-gradient-to-r from-[#111624] to-[#0a0d14] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-[#00f2aa] uppercase tracking-wider block">
                Rentro Ahmedabad • Self-Drive Voucher
              </span>
              <h2 className="text-2xl font-black mt-0.5">
                {booking.vehicle?.brand} {booking.vehicle?.model}
              </h2>
              <span className="text-xs text-slate-400">
                Reg: {booking.vehicle?.registration_number} • {booking.vehicle?.transmission} • {booking.vehicle?.fuel}
              </span>
            </div>
            <div className="text-right self-start sm:self-auto space-y-1">
              <Badge variant="success" size="md">
                {booking.status}
              </Badge>
              <span className="text-[11px] text-[#00f2aa] font-bold block">Online Payment Verified</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Hub Pickup Instructions */}
            <div className="rounded-2xl bg-[#00f2aa]/10 border border-[#00f2aa]/25 p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#00f2aa] font-bold text-sm">
                <Key className="w-4 h-4" />
                <span>Ahmedabad Hub Pickup Instructions</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <p>
                  <strong className="text-white">Hub Location:</strong> {booking.pickup_location?.name} ({booking.pickup_location?.address})
                </p>
                <p>
                  <strong className="text-white">Hub Contact:</strong> {booking.pickup_location?.contact_phone || '+91 98765 43210'}
                </p>
                <p className="text-slate-400">
                  Please bring your original physical Driving Licence at pickup. Our Ahmedabad fleet executive will perform a rapid 90-second digital vehicle checklist before handing over the keys.
                </p>
              </div>
            </div>

            {/* Schedule Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-[#141824] border border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                  <Calendar className="w-3.5 h-3.5 text-[#00f2aa]" />
                  <span>Pickup Time</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {formatDateTime(booking.start_date)}
                </div>
                <div className="text-xs text-slate-400">
                  {booking.pickup_location?.name}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                  <Clock className="w-3.5 h-3.5 text-[#00f2aa]" />
                  <span>Return Time</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {formatDateTime(booking.end_date)}
                </div>
                <div className="text-xs text-slate-400">
                  Duration: {booking.duration_hours} Hours
                </div>
              </div>
            </div>

            {/* Invoice Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#00f2aa] mb-3">
                Payment Breakdown (Invoice Receipt)
              </h3>
              <div className="border border-white/10 rounded-2xl overflow-hidden text-xs bg-[#141824]/50">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    <tr>
                      <td className="p-3.5">Self-Drive Rental Charges ({booking.duration_hours} hrs)</td>
                      <td className="p-3.5 text-right font-medium text-white">{formatCurrency(booking.base_amount)}</td>
                    </tr>
                    <tr>
                      <td className="p-3.5">
                        Refundable Security Deposit
                        <span className="block text-[10px] text-[#00f2aa] font-medium">Refunded on vehicle return</span>
                      </td>
                      <td className="p-3.5 text-right font-medium text-white">{formatCurrency(booking.deposit_amount)}</td>
                    </tr>
                    <tr>
                      <td className="p-3.5">GST Taxes & Comprehensive Fleet Insurance (18%)</td>
                      <td className="p-3.5 text-right font-medium text-white">{formatCurrency(booking.tax_amount)}</td>
                    </tr>
                    <tr className="bg-white/5 font-black text-white text-sm">
                      <td className="p-3.5">Total Amount Paid</td>
                      <td className="p-3.5 text-right text-[#00f2aa] text-base">{formatCurrency(booking.total_amount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-[#00f2aa]" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  <span>{copied ? 'Details Copied!' : 'Copy Booking Details'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print Receipt</span>
                </button>

                <a
                  href={`https://wa.me/919876543210?text=Hi%20Rentro,%20my%20booking%20ID%20is%20${encodeURIComponent(booking.booking_number)}.%20I%20have%20a%20question%20regarding%20my%20pickup.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#00f2aa]/10 hover:bg-[#00f2aa]/20 text-[#00f2aa] border border-[#00f2aa]/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#00f2aa]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onBrowseVehicles}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Browse More
                </button>
                <button
                  type="button"
                  onClick={onGoToDashboard}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-lg shadow-[#00f2aa]/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>My Bookings</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
