import React from 'react';
import { adminAuth } from '../../services/adminAuth';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  LayoutDashboard, 
  Car, 
  CalendarCheck2, 
  FileCheck, 
  ArrowLeft, 
  LogOut,
  MapPin,
  ShieldAlert
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: 'overview' | 'vehicles' | 'bookings' | 'kyc';
  setCurrentTab: (tab: 'overview' | 'vehicles' | 'bookings' | 'kyc') => void;
  onExitAdmin: () => void;
  onLogout: () => void;
  pendingKYCCount?: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onExitAdmin,
  onLogout,
  pendingKYCCount = 0,
  children,
}) => {
  const handleSignOut = () => {
    adminAuth.destroySession();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0d0f17] border-b md:border-b-0 md:border-r border-white/5 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg shadow-sm">
                R
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight block">RENTRO</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Ahmedabad Fleet</span>
              </div>
            </div>
            <span className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Live Hub
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setCurrentTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'overview'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Fleet Overview</span>
            </button>

            <button
              onClick={() => setCurrentTab('vehicles')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'vehicles'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Vehicles & Pricing</span>
            </button>

            <button
              onClick={() => setCurrentTab('bookings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'bookings'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Bookings & Inspections</span>
            </button>

            <button
              onClick={() => setCurrentTab('kyc')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'kyc'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCheck className="w-4 h-4" />
                <span>KYC Verification</span>
              </div>
              {pendingKYCCount > 0 && (
                <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">
                  {pendingKYCCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="pt-6 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-emerald-400">
              AH
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">Ahmedabad Control</span>
              <span className="text-[10px] text-emerald-400 block font-mono">Fleet Supervisor</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExitAdmin}
              className="w-full justify-start text-xs bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Customer Website</span>
            </Button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#07080c]">
        {children}
      </main>
    </div>
  );
};
