import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

interface LaunchPlanProps {
  onSelectCity: (city: 'Vadodara' | 'Ahmedabad') => void;
}

export const LaunchPlan: React.FC<LaunchPlanProps> = ({ onSelectCity }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#080c14] text-white border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header — Match to PDF Page 8 */}
        <div className="max-w-3xl space-y-3 mb-12 sm:mb-16">
          <div className="text-xs sm:text-sm font-black text-[#bef237] tracking-[0.2em] font-mono uppercase">
            07 • LAUNCH PLAN
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Start local. Build trust. Scale smart.
          </h2>
        </div>

        {/* Two Major City Cards — Exact match to PDF Page 8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14 sm:mb-20">
          
          {/* Card 1: VADODARA (Pilot market) */}
          <div className="bg-[#0e1c26] rounded-3xl p-8 sm:p-10 border border-white/10 hover:border-[#bef237]/40 transition-all shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-[#bef237] inline-block animate-pulse" />
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase">
                VADODARA
              </h3>
            </div>
            
            <div className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-[#bef237] bg-white/5 px-3 py-1 rounded-lg">
              Pilot market
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal pt-2">
              Partner with vehicle owners + rental operators and grow supply city by city.
            </p>

            <div className="pt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectCity('Vadodara')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#bef237] hover:underline cursor-pointer"
              >
                <span>Select Vadodara Pilot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: AHMEDABAD (Expansion market) */}
          <div className="bg-[#0e1c26] rounded-3xl p-8 sm:p-10 border border-white/10 hover:border-[#bef237]/40 transition-all shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-[#bef237] inline-block" />
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase">
                AHMEDABAD
              </h3>
            </div>
            
            <div className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-[#bef237] bg-white/5 px-3 py-1 rounded-lg">
              Expansion market
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal pt-2">
              Partner with vehicle owners + rental operators and grow supply city by city.
            </p>

            <div className="pt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectCity('Ahmedabad')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#bef237] hover:underline cursor-pointer"
              >
                <span>Explore Ahmedabad Network</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* 3 Bottom Metrics from PDF Page 8 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-white/10 text-center sm:text-left">
          
          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl font-black text-[#bef237] tracking-tight block">
              24×7
            </span>
            <span className="text-sm font-bold text-slate-300 uppercase tracking-wider block font-mono">
              Service promise
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl font-black text-[#bef237] tracking-tight block">
              4
            </span>
            <span className="text-sm font-bold text-slate-300 uppercase tracking-wider block font-mono">
              Vehicle categories
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl font-black text-[#bef237] tracking-tight block">
              1
            </span>
            <span className="text-sm font-bold text-slate-300 uppercase tracking-wider block font-mono">
              Unified platform
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LaunchPlan;
