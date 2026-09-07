import React from 'react';
import { Select } from '../ui/Select';
import { Location } from '../../types';
import { SlidersHorizontal, RotateCcw, Car, Bike } from 'lucide-react';

export interface FilterValues {
  type: 'all' | 'car' | 'bike';
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
  return (
    <div className="bg-[#0e111a] rounded-3xl p-6 border border-white/10 shadow-lg space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#00f2aa]" />
          <h3 className="text-sm font-bold text-white">Filter Vehicles</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#00f2aa] transition-colors font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Vehicle Type Toggle */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Vehicle Type
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#141824] rounded-2xl border border-white/5">
          <button
            type="button"
            onClick={() => onChange({ type: 'all' })}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filters.type === 'all'
                ? 'bg-[#00f2aa] text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onChange({ type: 'car' })}
            className={`flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filters.type === 'car'
                ? 'bg-[#00f2aa] text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            Cars
          </button>
          <button
            type="button"
            onClick={() => onChange({ type: 'bike' })}
            className={`flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filters.type === 'bike'
                ? 'bg-[#00f2aa] text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            Bikes
          </button>
        </div>
      </div>

      {/* Hub Location */}
      <div>
        <Select
          label="Pickup Hub"
          value={filters.locationId}
          onChange={(e) => onChange({ locationId: e.target.value })}
        >
          <option value="">All Ahmedabad Hubs</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Fuel Type */}
      <div>
        <Select
          label="Fuel / Power"
          value={filters.fuel}
          onChange={(e) => onChange({ fuel: e.target.value })}
        >
          <option value="all">All Fuel Types</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric (EV)</option>
        </Select>
      </div>

      {/* Transmission */}
      <div>
        <Select
          label="Transmission"
          value={filters.transmission}
          onChange={(e) => onChange({ transmission: e.target.value })}
        >
          <option value="all">All Transmissions</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </Select>
      </div>

      {/* Seating Capacity */}
      <div>
        <Select
          label="Seating Capacity"
          value={filters.seats}
          onChange={(e) => onChange({ seats: e.target.value })}
        >
          <option value="all">Any Seats</option>
          <option value="2">2 Seater (Bikes & Scooters)</option>
          <option value="4">4 Seater (Thar 4x4)</option>
          <option value="5">5 Seater (Sedans & SUVs)</option>
          <option value="7">7 Seater (Innova & XUV700)</option>
        </Select>
      </div>

      {/* Brand */}
      <div>
        <Select
          label="Brand"
          value={filters.brand}
          onChange={(e) => onChange({ brand: e.target.value })}
        >
          <option value="all">All Brands</option>
          <option value="Hyundai">Hyundai</option>
          <option value="Maruti Suzuki">Maruti Suzuki</option>
          <option value="Tata">Tata Motors</option>
          <option value="Mahindra">Mahindra</option>
          <option value="Toyota">Toyota</option>
          <option value="Kia">Kia</option>
          <option value="Volkswagen">Volkswagen</option>
          <option value="Royal Enfield">Royal Enfield</option>
          <option value="Honda">Honda</option>
          <option value="Yamaha">Yamaha</option>
          <option value="KTM">KTM</option>
          <option value="Ather">Ather</option>
          <option value="BMW">BMW Motorrad</option>
        </Select>
      </div>

      <div className="pt-2 text-xs text-slate-500 text-center font-mono">
        {totalResults} vehicles available
      </div>
    </div>
  );
};
