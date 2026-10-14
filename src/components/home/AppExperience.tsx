import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AppExperienceProps {
  onSearchClick: () => void;
  onBrowseClick: () => void;
}

export const AppExperience: React.FC<AppExperienceProps> = ({ onSearchClick, onBrowseClick }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#080c14] text-white border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header — Match to PDF Page 7 */}
        <div className="max-w-3xl space-y-3 mb-12 sm:mb-16">
          <div className="text-xs sm:text-sm font-black text-[#bef237] tracking-[0.2em] font-mono uppercase">
            06 • APP EXPERIENCE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Make the interface feel effortless.
          </h2>
        </div>

        {/* 6 Feature Cards — 2 rows x 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Smart search */}
          <div 
            onClick={onSearchClick}
            className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/40 transition-all shadow-xl group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center mb-6 shadow-md shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-[#bef237] transition-colors">
              Smart search
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Filter by vehicle type, location and availability.
            </p>
          </div>

          {/* 2. Transparent pricing */}
          <div 
            onClick={onBrowseClick}
            className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/40 transition-all shadow-xl group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center mb-6 shadow-md shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-[#bef237] transition-colors">
              Transparent pricing
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Show rates clearly before the customer commits.
            </p>
          </div>

          {/* 3. Easy booking */}
          <div 
            onClick={onBrowseClick}
            className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/40 transition-all shadow-xl group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center mb-6 shadow-md shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-[#bef237] transition-colors">
              Easy booking
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Keep the booking flow short and understandable.
            </p>
          </div>

          {/* 4. Availability */}
          <div 
            onClick={onBrowseClick}
            className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/40 transition-all shadow-xl group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center mb-6 shadow-md shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-[#bef237] transition-colors">
              Availability
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Let customers see what is ready to rent.
            </p>
          </div>

          {/* 5. Customer support */}
          <div 
            className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/40 transition-all shadow-xl group"
          >
            <div className="w-12 h-12 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center mb-6 shadow-md shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              Customer support
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Quick help through a simple support channel.
            </p>
            <a 
              href="mailto:support@rentro.in" 
              className="text-xs font-mono font-bold text-[#bef237] hover:underline inline-flex items-center gap-1"
            >
              support@rentro.in →
            </a>
          </div>

          {/* 6. Future-ready */}
          <div className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/40 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center mb-6 shadow-md shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2]" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Future-ready
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#bef237] uppercase">Roadmap</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Room for offers, subscriptions and loyalty features.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AppExperience;
