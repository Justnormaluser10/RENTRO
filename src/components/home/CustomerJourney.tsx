import React from 'react';
import { Search, SlidersHorizontal, Check, ArrowRight } from 'lucide-react';

interface CustomerJourneyProps {
  onSearchClick: () => void;
  onBrowseClick: () => void;
}

export const CustomerJourney: React.FC<CustomerJourneyProps> = ({ onSearchClick, onBrowseClick }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#080c14] text-white border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header — Match to PDF Page 4 */}
        <div className="max-w-3xl space-y-3 mb-12 sm:mb-16">
          <div className="text-xs sm:text-sm font-black text-[#bef237] tracking-[0.2em] font-mono uppercase">
            03 • CUSTOMER JOURNEY
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            From need to ride in 4 simple steps.
          </h2>
        </div>

        {/* 4 Connected Step Cards — Match to PDF Page 4 layout */}
        <div className="relative">
          
          {/* Subtle connecting line across cards on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-0.5 bg-white/10 -translate-y-12 z-0 pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            
            {/* Step 01: Search */}
            <div 
              onClick={onSearchClick}
              className="bg-[#0e1c26] rounded-3xl p-7 border border-white/10 hover:border-[#bef237]/40 transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block mb-4">
                  01
                </span>
                <div className="w-14 h-14 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center mb-6 shadow-lg shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
                  <Search className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-[#bef237] transition-colors">
                  Search
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Select city, date and vehicle type.
                </p>
              </div>
              <div className="pt-6 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-[#bef237] gap-1 group-hover:translate-x-1 transition-transform">
                <span>Start Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 02: Compare */}
            <div 
              onClick={onBrowseClick}
              className="bg-[#0e1c26] rounded-3xl p-7 border border-white/10 hover:border-[#bef237]/40 transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block mb-4">
                  02
                </span>
                <div className="w-14 h-14 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center mb-6 shadow-lg shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
                  <SlidersHorizontal className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-[#bef237] transition-colors">
                  Compare
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Check available options and rental rates.
                </p>
              </div>
              <div className="pt-6 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-[#bef237] gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 03: Book */}
            <div 
              onClick={onBrowseClick}
              className="bg-[#0e1c26] rounded-3xl p-7 border border-white/10 hover:border-[#bef237]/40 transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block mb-4">
                  03
                </span>
                <div className="w-14 h-14 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center mb-6 shadow-lg shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-[#bef237] transition-colors">
                  Book
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Choose the vehicle and confirm the rental.
                </p>
              </div>
              <div className="pt-6 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-[#bef237] gap-1 group-hover:translate-x-1 transition-transform">
                <span>Fast Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 04: Ride */}
            <div 
              onClick={onBrowseClick}
              className="bg-[#0e1c26] rounded-3xl p-7 border border-white/10 hover:border-[#bef237]/40 transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block mb-4">
                  04
                </span>
                <div className="w-14 h-14 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center mb-6 shadow-lg shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
                  <ArrowRight className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-[#bef237] transition-colors">
                  Ride
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Pick up / access the vehicle and go.
                </p>
              </div>
              <div className="pt-6 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-[#bef237] gap-1 group-hover:translate-x-1 transition-transform">
                <span>Self-Drive Freedom</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default CustomerJourney;
