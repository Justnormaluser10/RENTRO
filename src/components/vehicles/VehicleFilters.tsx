import React from 'react';
import { Select } from '../ui/Select';
import { Location } from '../../types';
import { SlidersHorizontal, RotateCcw, Car, Bike, Zap } from 'lucide-react';

export interface FilterValues {
  type: 'all' | 'car' | 'bike' | 'scooter' | 'ev';
  city: 'all' | 'Ahmedabad' | 'Vadodara';
  brand: string;
  fuel: string;
  transmission: string;
  seats: string;
  locationId: string;
  sortBy: 'recommended' | 'price_low' | 'price_high' | 'rating';
  searchQuery: string;
}

interface VehicleFiltersProps {
  filters: FilterValues;
  onChange: (updates: Partial<FilterValues>) => void;
  onReset: () => void;
  locations: Location[];
  totalResults: number;
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  onChange,
  onReset,
  locations,
  totalResults,
}) => {
  const filteredHubs = filters.city === 'all'
    ? locations
    : locations.filter(l => l.city.toLowerCase() === filters.city.toLowerCase());

  return (
    <div className="bg-[#0e1724] rounded-3xl p-6 border border-white/10 shadow-lg space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#bef237]" />
          <h3 className="text-sm font-bold text-white">Filter Rides</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#bef237] transition-colors font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Launch City Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Launch City
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#142330] rounded-2xl border border-white/5">
          <button
            type="button"
            onClick={() => onChange({ city: 'all', locationId: '' })}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filters.city === 'all'
                ? 'bg-[#bef237] text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Cities
          </button>
          <button
            type="button"
            onClick={() => onChange({ city: 'Vadodara', locationId: '' })}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filters.city === 'Vadodara'
                ? 'bg-[#bef237] text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vadodara (Pilot)
          </button>
          <button
            type="button"
            onClick={() => onChange({ city: 'Ahmedabad', locationId: '' })}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filters.city === 'Ahmedabad'
                ? 'bg-[#bef237] text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ahmedabad
          </button>
        </div>
      </div>

      {/* 4 Official Vehicle Categories Filter (PDF Page 1, 3, 5) */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Vehicle Category
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#142330] rounded-2xl border border-white/5">
          <button
            type="button"
            onClick={() => onChange({ type: 'all' })}
            className={`col-span-2 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filters.type === 'all'
                ? 'bg-[#bef237] text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          <button
            type="button"
            onClick={() => onChange({ type: 'bike' })}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filters.type === 'bike'
                ? 'bg-[#bef237] text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            Bikes
          </button>
          <button
            type="button"
            onClick={() => onChange({ type: 'scooter' })}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filters.type === 'scooter'
                ? 'bg-[#bef237] text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🛵</span>
            Scooters
          </button>
          <button
            type="button"
            onClick={() => onChange({ type: 'car' })}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filters.type === 'car'
                ? 'bg-[#bef237] text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            Cars
          </button>
          <button
            type="button"
            onClick={() => onChange({ type: 'ev' })}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filters.type === 'ev'
                ? 'bg-[#bef237] text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-[#bef237]" />
            EVs
          </button>
        </div>
      </div>

      {/* Pickup Hub */}
      <div>
        <Select
          label="Pickup Hub"
          value={filters.locationId}
          onChange={(e) => onChange({ locationId: e.target.value })}
        >
          <option value="">
            {filters.city === 'all' ? 'All Mobility Hubs (Vadodara & Ahmedabad)' : `All ${filters.city} Hubs`}
          </option>
          {filteredHubs.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name} ({loc.city})
            </option>
          ))}
        </Select>
      </div>

      {/* Fuel Type */}
      <div>
        <Select
          label="Fuel / Propulsion"
          value={filters.fuel}
          onChange={(e) => onChange({ fuel: e.target.value })}
        >
          <option value="">All Fuel Types</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric (EV)</option>
          <option value="cng">CNG</option>
        </Select>
      </div>

      {/* Transmission */}
      <div>
        <Select
          label="Transmission"
          value={filters.transmission}
          onChange={(e) => onChange({ transmission: e.target.value })}
        >
          <option value="">All Transmissions</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </Select>
      </div>

      {/* Seats */}
      <div>
        <Select
          label="Seating Capacity"
          value={filters.seats}
          onChange={(e) => onChange({ seats: e.target.value })}
        >
          <option value="">Any Capacity</option>
          <option value="2">2 Seater (Bikes & Scooters)</option>
          <option value="5">5 Seater (Hatchbacks & Sedans)</option>
          <option value="7">7 Seater (SUVs & MPVs)</option>
        </Select>
      </div>

      {/* Sort By */}
      <div>
        <Select
          label="Sort Results"
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value as FilterValues['sortBy'] })}
        >
          <option value="recommended">Recommended</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </Select>
      </div>

    </div>
  );
};

export default VehicleFilters;
