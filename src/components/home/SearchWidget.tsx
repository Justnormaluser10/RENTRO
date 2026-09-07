import React, { useEffect, useState, useRef } from 'react';
import { useBooking } from '../../context/BookingContext';
import { apiService } from '../../services/api';
import { Location } from '../../types';
import { AHMEDABAD_LOCALITIES } from '../../services/mockData';
import { Button } from '../ui/Button';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  Bike, 
  Search, 
  Sparkles, 
  ChevronDown,
  Check
} from 'lucide-react';

interface SearchWidgetProps {
  onSearch: () => void;
  compact?: boolean;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch, compact = false }) => {
  const { searchState, updateSearch, durationHours, applyQuickDurationPreset } = useBooking();
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationQuery, setLocationQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      const locs = await apiService.getLocations();
      setLocations(locs);
      if (locs.length > 0 && !searchState.pickupLocationId) {
        updateSearch({
          pickupLocationId: locs[0].id,
          returnLocationId: locs[0].id,
        });
        setLocationQuery(locs[0].name);
      } else if (searchState.pickupLocationId) {
        const current = locs.find(l => l.id === searchState.pickupLocationId);
        if (current) setLocationQuery(current.name);
      }
    };
    fetchLocations();
  }, []);

  // Close suggestion dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered Ahmedabad suggestions
  const filteredSuggestions = AHMEDABAD_LOCALITIES.filter((loc) =>
    loc.name.toLowerCase().includes(locationQuery.toLowerCase()) ||
    loc.zone.toLowerCase().includes(locationQuery.toLowerCase())
  );

  const handleSelectLocality = (locality: (typeof AHMEDABAD_LOCALITIES)[0]) => {
    setLocationQuery(locality.name);
    updateSearch({
      pickupLocationId: locality.hubId,
      returnLocationId: locality.hubId,
    });
    setShowLocationDropdown(false);
  };

  const handleSelectHub = (hub: Location) => {
    setLocationQuery(hub.name);
    updateSearch({
      pickupLocationId: hub.id,
      returnLocationId: hub.id,
    });
    setShowLocationDropdown(false);
  };

  const popularChips = ['SG Highway', 'Prahlad Nagar', 'Vastrapur', 'Airport Road', 'Navrangpura'];

  return (
    <div className={`w-full rounded-3xl bg-[#11141e]/95 backdrop-blur-2xl p-5 sm:p-7 border border-white/10 shadow-2xl ${compact ? 'shadow-lg' : 'neon-glow'}`}>
      
      {/* Top Type Selector Tabs & Duration Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-6">
        
        {/* Type Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => updateSearch({ vehicleType: 'all' })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              searchState.vehicleType === 'all'
                ? 'bg-[#00f2aa] text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Vehicles
          </button>
          <button
            type="button"
            onClick={() => updateSearch({ vehicleType: 'car' })}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              searchState.vehicleType === 'car'
                ? 'bg-[#00f2aa] text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            Cars
          </button>
          <button
            type="button"
            onClick={() => updateSearch({ vehicleType: 'bike' })}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              searchState.vehicleType === 'bike'
                ? 'bg-[#00f2aa] text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            Bikes
          </button>
        </div>

        {/* Duration Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline uppercase tracking-wider">
            Duration:
          </span>
          {(['1h', '6h', '1d', '2d', '7d'] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyQuickDurationPreset(preset)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-[#00f2aa]/20 hover:border-[#00f2aa]/40 hover:text-[#00f2aa] transition-colors cursor-pointer"
            >
              {preset === '1h' ? '1 hr' : preset === '6h' ? '6 hrs' : preset === '1d' ? '1 day' : preset === '2d' ? '2 days' : '1 week'}
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        
        {/* Ahmedabad Pickup Location with Search Suggestions */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Ahmedabad Pickup Hub
          </label>
          
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-[#00f2aa] pointer-events-none">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                setShowLocationDropdown(true);
              }}
              onFocus={() => setShowLocationDropdown(true)}
              placeholder="Search SG Highway, Prahlad Nagar, Airport..."
              className="w-full rounded-2xl bg-black/50 border border-white/10 pl-10 pr-9 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-[#00f2aa] focus:outline-none focus:ring-1 focus:ring-[#00f2aa] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="absolute right-3 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete Dropdown List */}
          {showLocationDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-[#0e111a] border border-white/15 shadow-2xl p-3 max-h-72 overflow-y-auto space-y-2 animate-fade-in">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold px-2">
                Ahmedabad Mobility Hubs
              </div>
              {locations.map((hub) => (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => handleSelectHub(hub)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/5 flex items-center justify-between text-slate-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#00f2aa] shrink-0" />
                    <div>
                      <span className="font-bold text-white block">{hub.name}</span>
                      <span className="text-[10px] text-slate-400 block">{hub.address}</span>
                    </div>
                  </div>
                  {searchState.pickupLocationId === hub.id && (
                    <Check className="w-3.5 h-3.5 text-[#00f2aa]" />
                  )}
                </button>
              ))}

              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold px-2 pt-2 border-t border-white/5">
                Popular Ahmedabad Localities
              </div>
              <div className="grid grid-cols-2 gap-1 px-1">
                {filteredSuggestions.slice(0, 8).map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectLocality(loc)}
                    className="text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-white/5 text-slate-300 transition-colors cursor-pointer truncate"
                  >
                    • {loc.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pickup Date & Time */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Pickup Date & Time
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            <input
              type="date"
              value={searchState.pickupDate}
              onChange={(e) => updateSearch({ pickupDate: e.target.value })}
              className="col-span-3 rounded-2xl border border-white/10 bg-black/50 px-3 py-3 text-xs text-white focus:border-[#00f2aa] focus:outline-none"
            />
            <input
              type="time"
              value={searchState.pickupTime}
              onChange={(e) => updateSearch({ pickupTime: e.target.value })}
              className="col-span-2 rounded-2xl border border-white/10 bg-black/50 px-2 py-3 text-xs text-white focus:border-[#00f2aa] focus:outline-none text-center"
            />
          </div>
        </div>

        {/* Return Date & Time */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Return Date & Time
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            <input
              type="date"
              value={searchState.returnDate}
              onChange={(e) => updateSearch({ returnDate: e.target.value })}
              className="col-span-3 rounded-2xl border border-white/10 bg-black/50 px-3 py-3 text-xs text-white focus:border-[#00f2aa] focus:outline-none"
            />
            <input
              type="time"
              value={searchState.returnTime}
              onChange={(e) => updateSearch({ returnTime: e.target.value })}
              className="col-span-2 rounded-2xl border border-white/10 bg-black/50 px-2 py-3 text-xs text-white focus:border-[#00f2aa] focus:outline-none text-center"
            />
          </div>
        </div>

        {/* Find Vehicles Button */}
        <div>
          <Button
            size="lg"
            onClick={onSearch}
            className="w-full gap-2 font-black bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-lg shadow-[#00f2aa]/20 text-xs sm:text-sm py-3.5 rounded-2xl"
          >
            <Search className="w-4 h-4" />
            <span>Find Available Vehicles</span>
          </Button>
        </div>
      </div>

      {/* Quick Location Chips */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-500 font-semibold">Popular Areas:</span>
          {popularChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                const matched = AHMEDABAD_LOCALITIES.find(l => l.name.toLowerCase().includes(chip.toLowerCase()));
                if (matched) handleSelectLocality(matched);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#00f2aa]/20 hover:text-[#00f2aa] text-slate-400 text-[11px] transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[#00f2aa] font-semibold text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Duration: {Math.round(durationHours)} hrs ({Math.round(durationHours / 24 * 10) / 10} days)</span>
        </div>
      </div>

    </div>
  );
};
