import React from 'react';
import { Vehicle } from '../../types';
import { VehicleCard } from '../vehicles/VehicleCard';
import { Button } from '../ui/Button';
import { Sparkles, Car, ArrowRight, MessageCircle } from 'lucide-react';

interface PopularVehiclesProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onBrowseAll: () => void;
  onExploreMap?: () => void;
}

export const PopularVehicles: React.FC<PopularVehiclesProps> = ({
  vehicles,
  onSelectVehicle,
  onBrowseAll,
  onExploreMap,
}) => {
  const hasVehicles = vehicles && vehicles.length > 0;

  return (
    <section className="py-20 bg-[#080c14] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#bef237] uppercase tracking-wider mb-2 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vadodara & Ahmedabad Verified Fleet</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Available Rides
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              100% verified bikes, scooters, cars, and EVs. Inspected and sanitised across our mobility hubs.
            </p>
          </div>

          {hasVehicles && (
            <Button
              variant="outline"
              onClick={onBrowseAll}
              className="self-start sm:self-auto gap-2 font-bold text-xs bg-white/5 border-white/10 hover:bg-white/10 text-white cursor-pointer"
            >
              <span>View All ({vehicles.length})</span>
              <ArrowRight className="w-4 h-4 text-[#bef237]" />
            </Button>
          )}
        </div>

        {/* Empty State vs Real Vehicles Grid */}
        {!hasVehicles ? (
          <div className="rounded-3xl bg-[#0e1c26] border border-white/10 p-10 sm:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-80 h-80 bg-[#bef237]/5 blur-3xl rounded-full pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-[#bef237]/10 border border-[#bef237]/20 text-[#bef237] flex items-center justify-center mx-auto shadow-lg shadow-[#bef237]/10">
              <Car className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto relative z-10">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Your next ride is coming soon.
              </h3>
              <p className="text-sm text-slate-400">
                We're onboarding verified fleet vehicles across Vadodara & Ahmedabad. Check back shortly or partner with Rentro.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 relative z-10">
              <a
                href="mailto:support@rentro.in"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#bef237] hover:bg-[#a3e635] text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-[#bef237]/20 transition-all cursor-pointer"
              >
                <span>Partner with Rentro → support@rentro.in</span>
              </a>

              {onExploreMap && (
                <Button
                  variant="outline"
                  onClick={onExploreMap}
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs sm:text-sm px-6 py-3 rounded-2xl font-bold cursor-pointer"
                >
                  Explore Ahmedabad Hubs
                </Button>
              )}
            </div>

            <div className="pt-6 border-t border-white/5 max-w-lg mx-auto grid grid-cols-3 gap-4 text-[11px] text-slate-400">
              <div>
                <span className="font-bold text-white block">100% Self-Drive</span>
                <span>Zero chauffeur hassle</span>
              </div>
              <div>
                <span className="font-bold text-white block">2 Cities</span>
                <span>Vadodara + Ahmedabad</span>
              </div>
              <div>
                <span className="font-bold text-white block">100% Refundable</span>
                <span>Security deposit policy</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onSelect={onSelectVehicle}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default PopularVehicles;
