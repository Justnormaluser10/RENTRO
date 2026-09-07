import React from 'react';
import { Vehicle } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Star, Users, Fuel, Gauge, MapPin, ArrowRight } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  selectedDurationHours?: number;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelect,
}) => {
  const primaryImg = vehicle.images?.find((img) => img.is_primary)?.image_url || 
    vehicle.images?.[0]?.image_url || 
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  const isAvailable = vehicle.status === 'AVAILABLE';

  return (
    <div className="group rounded-3xl bg-[#0e111a] border border-white/10 shadow-lg hover:border-[#00f2aa]/40 hover:shadow-2xl hover:shadow-[#00f2aa]/5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Header with Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
        <img
          src={primaryImg}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e111a] via-transparent to-transparent opacity-60" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge variant={isAvailable ? 'success' : 'danger'} size="sm">
            {isAvailable ? 'Available' : vehicle.status}
          </Badge>
          <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
            {vehicle.category}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 rounded-xl bg-black/70 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white flex items-center gap-1 border border-white/10">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{vehicle.rating}</span>
          <span className="text-slate-400 font-normal text-[11px]">({vehicle.review_count})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Brand & Model */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <span className="text-xs font-bold text-[#00f2aa] uppercase tracking-wider block">
                {vehicle.brand}
              </span>
              <h3 className="text-lg font-black text-white group-hover:text-[#00f2aa] transition-colors line-clamp-1">
                {vehicle.model}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 shrink-0">
              {vehicle.year}
            </span>
          </div>

          {/* Location */}
          {vehicle.location && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
              <MapPin className="w-3.5 h-3.5 text-[#00f2aa] shrink-0" />
              <span className="truncate">{vehicle.location.name}</span>
            </div>
          )}

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-500" />
              <span className="capitalize">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-500" />
              <span className="capitalize">{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{vehicle.seats} Seats</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Starting from</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-white">
                {formatCurrency(vehicle.pricing.daily_rate)}
              </span>
              <span className="text-xs text-slate-400 font-medium">/day</span>
            </div>
            <span className="text-[11px] text-[#00f2aa] font-bold block">
              ₹{vehicle.pricing.hourly_rate}/hr
            </span>
          </div>

          <button
            onClick={() => onSelect(vehicle)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 font-black text-xs shadow-md shadow-[#00f2aa]/20 transition-all cursor-pointer group-hover:gap-2"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
