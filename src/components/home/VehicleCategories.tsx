import React from 'react';
import { Bike, Car, Zap, ArrowRight } from 'lucide-react';
import { VehicleCategoryFilter } from '../../types';

interface VehicleCategoriesProps {
  onSelectCategory: (category: VehicleCategoryFilter) => void;
}

export const VehicleCategories: React.FC<VehicleCategoriesProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#080c14] text-white border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header — Match to PDF Page 5 */}
        <div className="max-w-3xl space-y-3 mb-12 sm:mb-16">
          <div className="text-xs sm:text-sm font-black text-[#bef237] tracking-[0.2em] font-mono uppercase">
            04 • WHAT YOU CAN RENT
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            One platform. Multiple ways to move.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 font-normal">
            Built to serve short trips, daily commutes, travel and flexible mobility.
          </p>
        </div>

        {/* 4 Category Cards — Exact styling and descriptions from PDF Page 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. BIKES */}
          <div 
            onClick={() => onSelectCategory('bike')}
            className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/40 hover:bg-[#122330] transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                🏍️
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-3 group-hover:text-[#bef237] transition-colors">
                BIKES
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Quick • practical • city-friendly
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#bef237]">
              <span>Explore Bikes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. SCOOTERS */}
          <div 
            onClick={() => onSelectCategory('scooter')}
            className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/40 hover:bg-[#122330] transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                🛵
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-3 group-hover:text-[#bef237] transition-colors">
                SCOOTERS
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Easy • efficient • everyday
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#bef237]">
              <span>Explore Scooters</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. CARS */}
          <div 
            onClick={() => onSelectCategory('car')}
            className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/40 hover:bg-[#122330] transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                🚗
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-3 group-hover:text-[#bef237] transition-colors">
                CARS
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Comfort • groups • longer trips
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#bef237]">
              <span>Explore Cars</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. EVs */}
          <div 
            onClick={() => onSelectCategory('ev')}
            className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/40 hover:bg-[#122330] transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl text-[#bef237] mb-8 group-hover:scale-110 transition-transform">
                <Zap className="w-9 h-9 fill-[#bef237] text-[#bef237]" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-3 group-hover:text-[#bef237] transition-colors">
                EVs
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Modern • efficient • future-ready
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#bef237]">
              <span>Explore EVs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default VehicleCategories;
