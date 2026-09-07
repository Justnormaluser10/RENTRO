import React, { useEffect, useState, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { apiService } from '../services/api';
import { Vehicle, Location } from '../types';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { VehicleFilters, FilterValues } from '../components/vehicles/VehicleFilters';
import { MobileFilterDrawer } from '../components/vehicles/MobileFilterDrawer';
import { SearchWidget } from '../components/home/SearchWidget';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronDown,
  Car
} from 'lucide-react';

interface VehiclesPageProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const VehiclesPage: React.FC<VehiclesPageProps> = ({ onSelectVehicle }) => {
  const { searchState, updateSearch, durationHours } = useBooking();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showDatesEdit, setShowDatesEdit] = useState(false);

  const [filters, setFilters] = useState<FilterValues>({
    type: searchState.vehicleType,
    brand: 'all',
    fuel: 'all',
    transmission: 'all',
    seats: 'all',
    locationId: searchState.pickupLocationId || '',
    sortBy: 'recommended',
    searchQuery: '',
  });

  // Sync with context searchState
  useEffect(() => {
    setFilters((prev: FilterValues) => ({
      ...prev,
      type: searchState.vehicleType,
      locationId: searchState.pickupLocationId || prev.locationId,
    }));
  }, [searchState.vehicleType, searchState.pickupLocationId]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [fetchedVehicles, fetchedLocations] = await Promise.all([
        apiService.getVehicles(),
        apiService.getLocations(),
      ]);
      setVehicles(fetchedVehicles);
      setLocations(fetchedLocations);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleFilterChange = (updates: Partial<FilterValues>) => {
    setFilters((prev: FilterValues) => ({ ...prev, ...updates }));
    if (updates.type) {
      updateSearch({ vehicleType: updates.type });
    }
  };

  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      brand: 'all',
      fuel: 'all',
      transmission: 'all',
      seats: 'all',
      locationId: '',
      sortBy: 'recommended',
      searchQuery: '',
    });
    updateSearch({ vehicleType: 'all' });
  };

  // Filter and Sort Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // Type
      if (filters.type !== 'all' && v.type !== filters.type) return false;
      // Brand
      if (filters.brand !== 'all' && v.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
      // Fuel
      if (filters.fuel !== 'all' && v.fuel.toLowerCase() !== filters.fuel.toLowerCase()) return false;
      // Transmission
      if (filters.transmission !== 'all' && v.transmission.toLowerCase() !== filters.transmission.toLowerCase()) return false;
      // Seats
      if (filters.seats !== 'all' && v.seats !== Number(filters.seats)) return false;
      // Location
      if (filters.locationId && v.location_id !== filters.locationId) return false;
      // Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesBrand = v.brand.toLowerCase().includes(q);
        const matchesModel = v.model.toLowerCase().includes(q);
        const matchesCategory = v.category.toLowerCase().includes(q);
        if (!matchesBrand && !matchesModel && !matchesCategory) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_low') {
        return a.pricing.daily_rate - b.pricing.daily_rate;
      }
      if (filters.sortBy === 'price_high') {
        return b.pricing.daily_rate - a.pricing.daily_rate;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0; // recommended order
    });
  }, [vehicles, filters]);

  const activeHub = locations.find(l => l.id === searchState.pickupLocationId) || locations[0];

  return (
    <div className="min-h-screen bg-[#07080c] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Active Booking Schedule Bar */}
        <div className="bg-[#0e111a] rounded-3xl p-4 sm:p-5 border border-white/10 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-[#00f2aa] shrink-0" />
                <span><strong className="text-white">Hub:</strong> {activeHub?.name || 'All Ahmedabad Hubs'}</span>
              </div>
              <div className="hidden sm:block text-slate-700">•</div>
              <div className="flex items-center gap-2 font-medium">
                <Calendar className="w-4 h-4 text-[#00f2aa] shrink-0" />
                <span><strong className="text-white">Pickup:</strong> {searchState.pickupDate} at {searchState.pickupTime}</span>
              </div>
              <div className="hidden sm:block text-slate-700">•</div>
              <div className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-[#00f2aa] shrink-0" />
                <span><strong className="text-white">Duration:</strong> {Math.round(durationHours)} hrs ({Math.round(durationHours / 24 * 10) / 10} days)</span>
              </div>
            </div>

            <button
              onClick={() => setShowDatesEdit(!showDatesEdit)}
              className="self-start md:self-auto text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
            >
              <span>{showDatesEdit ? 'Hide Date Picker' : 'Change Schedule'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDatesEdit ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showDatesEdit && (
            <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in">
              <SearchWidget onSearch={() => setShowDatesEdit(false)} compact />
            </div>
          )}
        </div>

        {/* Search & Sort Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-80 relative">
            <Input
              placeholder="Search make or model..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
              leftIcon={<Search className="w-4 h-4 text-slate-500" />}
              className="bg-[#0e111a] border-white/10 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile Filter Toggle Button */}
            <Button
              variant="outline"
              size="md"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden gap-2 font-semibold text-xs bg-white/5 border-white/10 text-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#00f2aa]" />
              <span>Filters ({filteredVehicles.length})</span>
            </Button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange({ sortBy: e.target.value as FilterValues['sortBy'] })}
                className="rounded-xl border border-white/10 bg-[#0e111a] px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#00f2aa] cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated (★)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters (Desktop) + Vehicle Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <VehicleFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              locations={locations}
              totalResults={filteredVehicles.length}
            />
          </div>

          {/* Vehicle Grid (3 cols on desktop) */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="rounded-3xl bg-[#0e111a] border border-white/10 p-4 h-80 animate-pulse">
                    <div className="aspect-16/10 bg-white/5 rounded-2xl mb-4" />
                    <div className="h-4 bg-white/5 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-1/2 mb-4" />
                    <div className="h-10 bg-white/5 rounded-2xl mt-8" />
                  </div>
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="rounded-3xl bg-[#0e111a] border border-white/10 p-12 text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-[#00f2aa]/10 border border-[#00f2aa]/20 text-[#00f2aa] flex items-center justify-center mx-auto shadow-lg shadow-[#00f2aa]/10">
                  <Car className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Your next ride is coming soon.
                  </h3>
                  <p className="text-sm text-slate-400">
                    We're adding vehicles in Ahmedabad. Check back shortly.
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href="https://wa.me/919876543210?text=Hi%20Rentro,%20I%20am%20looking%20for%20a%20self-drive%20car/bike%20in%20Ahmedabad"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 font-bold text-xs shadow-lg shadow-[#00f2aa]/20 cursor-pointer"
                  >
                    <span>Need a specific car or bike? Chat with us on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="rounded-3xl bg-[#0e111a] border border-white/10 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">No vehicles match your criteria</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your filters, location, or vehicle category to explore more options from our fleet.
                </p>
                <Button onClick={handleResetFilters} variant="outline" size="sm" className="bg-white/5 border-white/10 text-white">
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onSelect={onSelectVehicle}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        locations={locations}
        totalResults={filteredVehicles.length}
      />
    </div>
  );
};
