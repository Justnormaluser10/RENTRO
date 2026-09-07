import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminVehiclesPage } from './pages/admin/AdminVehiclesPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminKYCPage } from './pages/admin/AdminKYCPage';
import { adminAuth } from './services/adminAuth';
import { Vehicle } from './types';
import { isSupabaseConfigured } from './lib/supabase';
import { paymentService } from './services/payment';
import { ShieldCheck, Info, X } from 'lucide-react';

function AppContent() {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { setDraftVehicle } = useBooking();

  // Simple client-side routing
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedVehicleForCheckout, setSelectedVehicleForCheckout] = useState<Vehicle | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Admin Tab State
  const [adminTab, setAdminTab] = useState<'overview' | 'vehicles' | 'bookings' | 'kyc'>('overview');

  // Dev Notice Banner
  const [showDevBanner, setShowDevBanner] = useState<boolean>(true);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicleId(vehicle.id);
    setSelectedVehicleForCheckout(vehicle);
    navigate(`/vehicles/${vehicle.id}`);
  };

  const handleProceedToCheckout = (vehicle: Vehicle) => {
    setSelectedVehicleForCheckout(vehicle);
    setDraftVehicle(vehicle);
    navigate('/checkout');
  };

  const handleBookingSuccess = (bookingId: string) => {
    setConfirmedBookingId(bookingId);
    navigate(`/booking-confirmation/${bookingId}`);
  };

  // -------------------------------------------------------------
  // ADMIN PORTAL ROUTING (Secured with RENTRO10 SHA-256 Auth)
  // -------------------------------------------------------------
  if (currentPath === '/admin/login') {
    return (
      <AdminLoginPage
        onSuccess={() => navigate('/admin')}
        onExit={() => navigate('/')}
      />
    );
  }

  if (currentPath.startsWith('/admin')) {
    if (!adminAuth.isAdminAuthenticated()) {
      return (
        <AdminLoginPage
          onSuccess={() => navigate(currentPath)}
          onExit={() => navigate('/')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        setCurrentTab={setAdminTab}
        onExitAdmin={() => navigate('/')}
        onLogout={() => {
          adminAuth.destroySession();
          navigate('/admin/login');
        }}
        pendingKYCCount={1}
      >
        {adminTab === 'overview' && <AdminDashboardPage onNavigateTab={setAdminTab} />}
        {adminTab === 'vehicles' && <AdminVehiclesPage />}
        {adminTab === 'bookings' && <AdminBookingsPage />}
        {adminTab === 'kyc' && <AdminKYCPage />}
      </AdminLayout>
    );
  }

  // -------------------------------------------------------------
  // CUSTOMER SITE ROUTING
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-white selection:bg-[#00f2aa]/30 selection:text-[#00f2aa]">
      {/* Dev Mode Environment Info Banner */}
      {showDevBanner && !isSupabaseConfigured && (
        <div className="bg-[#0e111a] text-slate-300 px-4 py-2 text-xs border-b border-white/10 flex items-center justify-between z-50">
          <div className="flex items-center gap-2 max-w-4xl mx-auto text-center sm:text-left">
            <Info className="w-4 h-4 text-[#00f2aa] shrink-0 hidden sm:inline" />
            <span>
              <strong>Rentro Ahmedabad Live Preview:</strong> Real-time self-drive booking engine. Manage fleet in Admin Portal (Password: <code className="text-[#00f2aa] font-mono">RENTRO10</code>).
            </span>
          </div>
          <button
            onClick={() => setShowDevBanner(false)}
            className="text-slate-400 hover:text-white p-1 ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navbar */}
      <Navbar currentPath={currentPath} navigate={navigate} />

      {/* Page Views */}
      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            onNavigate={navigate}
            onSelectVehicle={handleSelectVehicle}
          />
        )}

        {currentPath === '/vehicles' && (
          <VehiclesPage onSelectVehicle={handleSelectVehicle} />
        )}

        {currentPath.startsWith('/vehicles/') && selectedVehicleId && (
          <VehicleDetailPage
            vehicleId={selectedVehicleId}
            onBack={() => navigate('/vehicles')}
            onProceedToCheckout={handleProceedToCheckout}
            onSelectAlternative={handleSelectVehicle}
          />
        )}

        {currentPath === '/checkout' && (
          selectedVehicleForCheckout ? (
            <CheckoutPage
              vehicle={selectedVehicleForCheckout}
              onBack={() => navigate(`/vehicles/${selectedVehicleForCheckout.id}`)}
              onBookingSuccess={handleBookingSuccess}
            />
          ) : (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
              <h2 className="text-2xl font-black text-white">No Vehicle Selected for Checkout</h2>
              <p className="text-xs text-slate-400 max-w-sm">
                Please browse our self-drive fleet in Ahmedabad and select a vehicle to begin reservation.
              </p>
              <button
                onClick={() => navigate('/vehicles')}
                className="py-3 px-6 rounded-xl font-black text-xs bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-lg shadow-[#00f2aa]/20 cursor-pointer"
              >
                Browse Ahmedabad Fleet
              </button>
            </div>
          )
        )}

        {currentPath.startsWith('/booking-confirmation') && (
          <BookingConfirmationPage
            bookingId={confirmedBookingId || 'bkg-1'}
            onGoToDashboard={() => navigate('/dashboard')}
            onBrowseVehicles={() => navigate('/vehicles')}
          />
        )}

        {currentPath === '/dashboard' && (
          <CustomerDashboardPage onBrowseVehicles={() => navigate('/vehicles')} />
        )}

        {currentPath === '/how-it-works' && (
          <HowItWorksPage onBrowseVehicles={() => navigate('/vehicles')} />
        )}

        {currentPath === '/login' && (
          <LoginPage
            onSuccess={() => navigate('/')}
            onNavigateSignUp={() => navigate('/signup')}
          />
        )}

        {currentPath === '/signup' && (
          <SignUpPage
            onSuccess={() => navigate('/')}
            onNavigateLogin={() => navigate('/login')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
