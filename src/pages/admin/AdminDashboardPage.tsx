import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { Vehicle, Booking, KYCDocument } from '../../types';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Car, 
  Key, 
  CalendarCheck, 
  IndianRupee, 
  FileCheck, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigateTab: (tab: 'overview' | 'vehicles' | 'bookings' | 'kyc') => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateTab }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [kycDocs, setKycDocs] = useState<KYCDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAdminMetrics = async () => {
      setIsLoading(true);
      const [vList, bList, kList] = await Promise.all([
        apiService.getVehicles(),
        apiService.getBookings(undefined, 'admin'),
        apiService.getKYCDocuments(),
      ]);
      setVehicles(vList);
      setBookings(bList);
      setKycDocs(kList);
      setIsLoading(false);
    };
    loadAdminMetrics();
  }, []);

  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const activeRentals = bookings.filter(b => b.status === 'ACTIVE').length;
  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const pendingKYC = kycDocs.filter(k => k.status === 'PENDING').length;
  
  // Total Revenue: sum of all non-cancelled bookings
  const totalRevenue = bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.total_amount || 0), 0);

  const recentBookings = bookings.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#00f2aa] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ahmedabad Fleet Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fleet Control & Metrics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => onNavigateTab('vehicles')}
            className="font-bold text-xs bg-emerald-600 hover:bg-emerald-500"
          >
            + Add New Vehicle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('kyc')}
            className="font-bold text-xs bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
          >
            Review KYC ({pendingKYC})
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Vehicles */}
        <div 
          onClick={() => onNavigateTab('vehicles')}
          className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-slate-600 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Fleet</span>
            <Car className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{totalVehicles}</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              {availableVehicles} Available
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">10 Cars • 10 Bikes active across 3 hubs</p>
        </div>

        {/* Active Rentals */}
        <div 
          onClick={() => onNavigateTab('bookings')}
          className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-slate-600 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active On Road</span>
            <Key className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{activeRentals}</span>
            <span className="text-xs font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800">
              In Transit
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Customers currently driving</p>
        </div>

        {/* Upcoming Bookings */}
        <div 
          onClick={() => onNavigateTab('bookings')}
          className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-slate-600 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Bookings</span>
            <CalendarCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{upcomingBookings}</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
              Confirmed
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Ready for customer hub pickup</p>
        </div>

        {/* Total Platform Revenue */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
            <span>Razorpay Processed</span>
          </p>
        </div>
      </div>

      {/* KYC Alert Banner if pending */}
      {pendingKYC > 0 && (
        <div className="rounded-2xl bg-amber-950/60 border border-amber-800/80 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-amber-300 font-medium">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              There {pendingKYC === 1 ? 'is' : 'are'} <strong className="text-white font-bold">{pendingKYC} customer driving licence(s)</strong> awaiting staff approval before vehicle handover.
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => onNavigateTab('kyc')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0"
          >
            Review Documents
          </Button>
        </div>
      )}

      {/* Recent Bookings Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Recent Fleet Bookings
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateTab('bookings')}
            className="text-emerald-400 hover:text-emerald-300 hover:bg-slate-700 text-xs"
          >
            Manage All ({bookings.length}) →
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700 font-semibold">
                <th className="pb-3">Booking ID</th>
                <th className="pb-3">Vehicle</th>
                <th className="pb-3">Pickup Time</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-750/50">
                  <td className="py-3 font-mono font-bold text-white">{b.booking_number}</td>
                  <td className="py-3 font-medium text-white">
                    {b.vehicle?.brand} {b.vehicle?.model}
                  </td>
                  <td className="py-3 text-slate-400">{formatDateTime(b.start_date)}</td>
                  <td className="py-3">{b.duration_hours} hrs</td>
                  <td className="py-3 font-bold text-emerald-400">{formatCurrency(b.total_amount)}</td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.status === 'CONFIRMED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      b.status === 'ACTIVE' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                      b.status === 'COMPLETED' ? 'bg-slate-700 text-slate-300' : 'bg-rose-950 text-rose-400'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onNavigateTab('bookings')}
                      className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
                    >
                      Inspect / Log
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
