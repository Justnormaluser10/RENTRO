import React from 'react';
import { Check, ArrowRight, Zap, Bike, Car } from 'lucide-react';
import { VehicleCategoryFilter } from '../../types';

interface MeetRentroSolutionProps {
  onSelectCategory: (category: VehicleCategoryFilter) => void;
}

export const MeetRentroSolution: React.FC<MeetRentroSolutionProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#080c14] text-white border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header — Exact match to PDF Page 3 */}
        <div className="max-w-3xl space-y-3 mb-12 sm:mb-16">
          <div className="text-xs sm:text-sm font-black text-[#bef237] tracking-[0.2em] font-mono uppercase">
            02 • OUR SOLUTION
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Meet RENTRO.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 font-normal">
            A rental marketplace designed around what customers actually need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Visual Interactive Selector Card — As illustrated in PDF Page 3 */}
          <div className="lg:col-span-6">
            <div className="bg-[#0e1c26] rounded-3xl p-7 sm:p-9 border border-white/10 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="inline-block bg-[#bef237] text-slate-950 font-black text-xs font-mono uppercase px-3 py-1 rounded-lg tracking-wider">
                  RENTRO
                </span>
                <span className="text-xs font-mono text-slate-400">Launch Platform</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Choose your ride.
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select a category to explore verified inventory in Vadodara & Ahmedabad:
                </p>
              </div>

              {/* 4 Interactive Category Tiles */}
              <div className="grid grid-cols-2 gap-3.5">
                
                {/* Bike */}
                <button
                  type="button"
                  onClick={() => onSelectCategory('bike')}
                  className="p-5 rounded-2xl bg-[#142330] border border-white/5 hover:border-[#bef237]/50 hover:bg-[#182b3a] transition-all text-left flex items-center gap-3.5 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#bef237] group-hover:bg-[#bef237] group-hover:text-slate-950 transition-colors">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-white block text-sm group-hover:text-[#bef237] transition-colors">Bike</span>
                    <span className="text-[10px] text-slate-400">Geared & Commuter</span>
                  </div>
                </button>

                {/* Scooter */}
                <button
                  type="button"
                  onClick={() => onSelectCategory('scooter')}
                  className="p-5 rounded-2xl bg-[#142330] border border-white/5 hover:border-[#bef237]/50 hover:bg-[#182b3a] transition-all text-left flex items-center gap-3.5 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🛵
                  </div>
                  <div>
                    <span className="font-black text-white block text-sm group-hover:text-[#bef237] transition-colors">Scooter</span>
                    <span className="text-[10px] text-slate-400">Easy & Everyday</span>
                  </div>
                </button>

                {/* Car */}
                <button
                  type="button"
                  onClick={() => onSelectCategory('car')}
                  className="p-5 rounded-2xl bg-[#142330] border border-white/5 hover:border-[#bef237]/50 hover:bg-[#182b3a] transition-all text-left flex items-center gap-3.5 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#bef237] group-hover:bg-[#bef237] group-hover:text-slate-950 transition-colors">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-white block text-sm group-hover:text-[#bef237] transition-colors">Car</span>
                    <span className="text-[10px] text-slate-400">Hatch, Sedan & SUV</span>
                  </div>
                </button>

                {/* EV */}
                <button
                  type="button"
                  onClick={() => onSelectCategory('ev')}
                  className="p-5 rounded-2xl bg-[#142330] border border-white/5 hover:border-[#bef237]/50 hover:bg-[#182b3a] transition-all text-left flex items-center gap-3.5 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#bef237] group-hover:bg-[#bef237] group-hover:text-slate-950 transition-colors">
                    <Zap className="w-5 h-5 fill-[#bef237]" />
                  </div>
                  <div>
                    <span className="font-black text-white block text-sm group-hover:text-[#bef237] transition-colors">EV</span>
                    <span className="text-[10px] text-slate-400">Electric Mobility</span>
                  </div>
                </button>

              </div>

              <div className="pt-2 text-center border-t border-white/5">
                <span className="text-xs font-bold text-[#bef237] tracking-wider uppercase font-mono">
                  Simple. Fast. Local.
                </span>
              </div>

            </div>
          </div>

          {/* Right 4 Value Propositions with Lime Checkmarks — PDF Page 3 */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. 24x7 service */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-[#bef237]/20">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white flex items-center gap-2">
                  24×7 service
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#bef237] font-semibold uppercase">Promise</span>
                </h4>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Support and rental access built for real-life schedules.
                </p>
              </div>
            </div>

            {/* 2. Easy rentals */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-[#bef237]/20">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white">Easy rentals</h4>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  A clear path from vehicle discovery to booking.
                </p>
              </div>
            </div>

            {/* 3. Affordable rates */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-[#bef237]/20">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white">Affordable rates</h4>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Value-focused options for everyday mobility.
                </p>
              </div>
            </div>

            {/* 4. Multiple vehicle types */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-[#bef237]/20">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white">Multiple vehicle types</h4>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Bike, scooter, car and EV rentals in one place.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default MeetRentroSolution;
