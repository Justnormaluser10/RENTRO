import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { adminAuth } from '../../services/adminAuth';
import { Button } from '../ui/Button';
import { 
  Car, 
  Bike, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  LogOut, 
  CalendarDays,
  LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { updateSearch } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    setIsAdminAuthenticated(adminAuth.isAdminAuthenticated());
  }, [currentPath]);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleFilterNav = (type: 'car' | 'bike') => {
    updateSearch({ vehicleType: type });
    setMobileMenuOpen(false);
    navigate('/vehicles');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07080c]/85 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#111624] to-[#0a0d14] border border-white/15 flex items-center justify-center text-white shadow-md group-hover:border-[#00f2aa]/50 transition-all">
                <span className="font-black text-xl tracking-tight flex items-center">
                  R<span className="w-2 h-2 rounded-full bg-[#00f2aa] inline-block ml-0.5 animate-pulse"></span>
                </span>
              </div>
              <div className="text-left">
                <span className="text-xl font-black tracking-tight text-white block leading-tight">
                  RENTRO
                </span>
                <span className="text-[10px] font-bold text-[#00f2aa] tracking-widest uppercase block">
                  Ahmedabad • Self-Drive
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => handleNavClick('/')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  currentPath === '/' ? 'text-[#00f2aa] bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleFilterNav('car')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  currentPath === '/vehicles' ? 'text-[#00f2aa]' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Car className="w-3.5 h-3.5 text-[#00f2aa]" />
                Cars
              </button>
              <button
                onClick={() => handleFilterNav('bike')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Bike className="w-3.5 h-3.5 text-[#00f2aa]" />
                Bikes
              </button>
              <button
                onClick={() => handleNavClick('/how-it-works')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  currentPath === '/how-it-works' ? 'text-[#00f2aa] bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                How It Works
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => handleNavClick('/dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                    currentPath === '/dashboard' ? 'text-[#00f2aa] bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  My Bookings
                </button>
              )}
            </nav>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Show Admin Portal button ONLY if admin session exists */}
            {isAdminAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavClick(currentPath.startsWith('/admin') ? '/' : '/admin')}
                className="gap-1.5 bg-[#00f2aa]/10 border-[#00f2aa]/30 text-[#00f2aa] hover:bg-[#00f2aa]/20 text-xs font-bold"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {currentPath.startsWith('/admin') ? 'Customer View' : 'Fleet Admin Portal'}
              </Button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('/dashboard')}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-white/5 border border-white/10 transition-colors text-left cursor-pointer"
                >
                  <img
                    src={user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.full_name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">
                      {user?.full_name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      Customer
                    </span>
                  </div>
                </button>
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('/signup')}
                  className="px-4 py-2 text-xs font-bold bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 rounded-xl shadow-md shadow-[#00f2aa]/20 transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0e111a] px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-2xl">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('/')}
              className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-white/5 text-slate-200"
            >
              Home
            </button>
            <button
              onClick={() => handleFilterNav('car')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-white/5 text-slate-200"
            >
              <Car className="w-4 h-4 text-[#00f2aa]" />
              Cars
            </button>
            <button
              onClick={() => handleFilterNav('bike')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-white/5 text-slate-200"
            >
              <Bike className="w-4 h-4 text-[#00f2aa]" />
              Bikes
            </button>
            <button
              onClick={() => handleNavClick('/how-it-works')}
              className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-white/5 text-slate-200"
            >
              How It Works
            </button>
            {isAuthenticated && (
              <button
                onClick={() => handleNavClick('/dashboard')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-white/5 text-slate-200"
              >
                <CalendarDays className="w-4 h-4 text-[#00f2aa]" />
                My Bookings
              </button>
            )}
            {isAdminAuthenticated && (
              <button
                onClick={() => handleNavClick('/admin')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-[#00f2aa]/10 text-[#00f2aa]"
              >
                <LayoutDashboard className="w-4 h-4 text-[#00f2aa]" />
                Fleet Admin Portal
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-white/10">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-bold text-white">{user?.full_name}</span>
                </div>
                <button onClick={logout} className="text-xs font-bold text-rose-400">
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="py-2.5 px-3 rounded-xl border border-white/10 text-white text-xs font-bold text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('/signup')}
                  className="py-2.5 px-3 rounded-xl bg-[#00f2aa] text-slate-950 text-xs font-bold text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
