import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Booking, BookingStatus, Inspection } from '../../types';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { 
  CalendarCheck2, 
  Search, 
  Key, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  FileText, 
  Camera, 
  Fuel, 
  Gauge, 
  DollarSign
} from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [inspectionModalBooking, setInspectionModalBooking] = useState<{
    booking: Booking;
    type: 'PICKUP' | 'RETURN';
  } | null>(null);

  // Inspection Form State
  const [odometer, setOdometer] = useState<number>(15400);
  const [fuelLevel, setFuelLevel] = useState<number>(100);
  const [conditionNotes, setConditionNotes] = useState('All body panels and interior clean. Standard tyre pressure.');
  const [lateFee, setLateFee] = useState<number>(0);
  const [damageCharge, setDamageCharge] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    const data = await apiService.getBookings(undefined, 'admin');
    setBookings(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenPickup = (b: Booking) => {
    setInspectionModalBooking({ booking: b, type: 'PICKUP' });
    setOdometer(14500);
    setFuelLevel(100);
    setConditionNotes('Vehicle cleaned, sanitized, and keys handed to customer.');
    setLateFee(0);
    setDamageCharge(0);
  };

  const handleOpenReturn = (b: Booking) => {
    setInspectionModalBooking({ booking: b, type: 'RETURN' });
    setOdometer(14780);
    setFuelLevel(95);
    setConditionNotes('Vehicle returned in good order.');
    setLateFee(0);
    setDamageCharge(0);
  };

  const handleInspectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectionModalBooking) return;

    setIsSubmitting(true);
    const inspection: Inspection = {
      id: 'insp-' + Date.now(),
      booking_id: inspectionModalBooking.booking.id,
      type: inspectionModalBooking.type,
      odometer_reading: odometer,
      fuel_level: fuelLevel,
      condition_notes: conditionNotes,
      photo_urls: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'],
      late_fee: Number(lateFee) || 0,
      damage_charges: Number(damageCharge) || 0,
      extra_charges: 0,
      recorded_by: 'Vikram Mehta (Admin)',
      created_at: new Date().toISOString(),
    };

    await apiService.recordInspection(inspection);
    setIsSubmitting(false);
    setInspectionModalBooking(null);
    await fetchBookings();
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking and initiate a refund?')) {
      await apiService.cancelBooking(bookingId, 'Admin fleet adjustment');
      await fetchBookings();
    }
  };

  const filtered = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const customer = b.customer?.full_name?.toLowerCase() || '';
      const vehicle = `${b.vehicle?.brand} ${b.vehicle?.model}`.toLowerCase();
      return (
        b.booking_number.toLowerCase().includes(q) ||
        customer.includes(q) ||
        vehicle.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Bookings & Fleet Inspections
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Log pickup handover odometer/fuel readings, approve vehicle return, and add late/damage fees.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700 overflow-x-auto max-w-full">
          {(['all', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status === 'all' ? `All (${bookings.length})` : status}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search booking ID, customer, car..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-xs"
            leftIcon={<Search className="w-4 h-4 text-slate-500" />}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700 bg-slate-900/50 font-semibold">
                <th className="p-4">Booking</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Pickup Hub & Time</th>
                <th className="p-4">Return Schedule</th>
                <th className="p-4">Total Paid</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Handover & Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-750/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">
                    {b.booking_number}
                    <span className="text-[10px] text-emerald-400 block font-sans">Razorpay Paid</span>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-white block">{b.customer?.full_name || 'Customer'}</span>
                    <span className="text-[11px] text-slate-400 block">{b.customer?.phone || '+91 98450 12345'}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">KYC Approved</span>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-white block">{b.vehicle?.brand} {b.vehicle?.model}</span>
                    <span className="text-[10px] font-mono text-slate-400">{b.vehicle?.registration_number}</span>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <span className="text-white font-medium block">{formatDateTime(b.start_date)}</span>
                    <span className="text-[10px] text-slate-400 block">{b.pickup_location?.name}</span>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <span className="text-white font-medium block">{formatDateTime(b.end_date)}</span>
                    <span className="text-[10px] text-slate-400 block">Duration: {b.duration_hours} hrs</span>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <span className="font-black text-emerald-400 text-sm block">{formatCurrency(b.total_amount)}</span>
                    <span className="text-[10px] text-slate-400 block">Deposit: {formatCurrency(b.deposit_amount)}</span>
                  </td>

                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold ${
                      b.status === 'CONFIRMED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      b.status === 'ACTIVE' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                      b.status === 'COMPLETED' ? 'bg-slate-700 text-slate-300' : 'bg-rose-950 text-rose-400'
                    }`}>
                      {b.status}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {b.status === 'CONFIRMED' && (
                      <Button
                        size="sm"
                        onClick={() => handleOpenPickup(b)}
                        className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs gap-1.5"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Log Pickup</span>
                      </Button>
                    )}

                    {b.status === 'ACTIVE' && (
                      <Button
                        size="sm"
                        onClick={() => handleOpenReturn(b)}
                        className="bg-sky-600 hover:bg-sky-500 font-bold text-xs gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Log Return</span>
                      </Button>
                    )}

                    {b.status === 'COMPLETED' && (
                      <span className="text-slate-500 text-xs font-semibold">
                        Trip Completed
                      </span>
                    )}

                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        title="Cancel booking"
                        className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal for Pickup / Return */}
      {inspectionModalBooking && (
        <Modal
          isOpen={true}
          onClose={() => setInspectionModalBooking(null)}
          title={
            inspectionModalBooking.type === 'PICKUP'
              ? 'Vehicle Pickup Inspection Log'
              : 'Vehicle Return & Final Inspection'
          }
          description={`Booking ${inspectionModalBooking.booking.booking_number} — ${inspectionModalBooking.booking.vehicle?.brand} ${inspectionModalBooking.booking.vehicle?.model}`}
          maxWidth="lg"
        >
          <form onSubmit={handleInspectionSubmit} className="space-y-4 text-slate-900">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{inspectionModalBooking.booking.customer?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle Registration:</span>
                <span className="font-mono font-bold text-slate-900">{inspectionModalBooking.booking.vehicle?.registration_number}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Odometer Reading (KM)"
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                leftIcon={<Gauge className="w-4 h-4" />}
                required
              />

              <Input
                label="Fuel / Battery Level (%)"
                type="number"
                min={0}
                max={100}
                value={fuelLevel}
                onChange={(e) => setFuelLevel(Number(e.target.value))}
                leftIcon={<Fuel className="w-4 h-4" />}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Condition & Inspection Notes
              </label>
              <textarea
                value={conditionNotes}
                onChange={(e) => setConditionNotes(e.target.value)}
                placeholder="Log any pre-existing scratches, tyre condition, sanitization..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200"
                rows={3}
                required
              />
            </div>

            {/* If RETURN, allow adding late fee or damage charges */}
            {inspectionModalBooking.type === 'RETURN' && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  Additional Charges (If Applicable)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Late Return Fee (₹)"
                    type="number"
                    value={lateFee}
                    onChange={(e) => setLateFee(Number(e.target.value))}
                    placeholder="0"
                  />
                  <Input
                    label="Damage / Clean Charge (₹)"
                    type="number"
                    value={damageCharge}
                    onChange={(e) => setDamageCharge(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <p className="text-[11px] text-amber-800">
                  Any additional fees will be deducted from the customer's refundable security deposit ({formatCurrency(inspectionModalBooking.booking.deposit_amount)}).
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="ghost" size="sm" type="button" onClick={() => setInspectionModalBooking(null)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" isLoading={isSubmitting} className="font-bold">
                {inspectionModalBooking.type === 'PICKUP' ? 'Confirm Handover to Customer' : 'Confirm Return & Complete Booking'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
