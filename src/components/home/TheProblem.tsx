import React from 'react';
import { Search, Clock, IndianRupee, ArrowRight } from 'lucide-react';

export const TheProblem: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#080c14] text-white border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header — Exact match to PDF Page 2 */}
        <div className="max-w-3xl space-y-3 mb-12 sm:mb-16">
          <div className="text-xs sm:text-sm font-black text-[#bef237] tracking-[0.2em] font-mono uppercase">
            01 • THE PROBLEM
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Renting a vehicle shouldn't feel complicated.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 font-normal">
            Customers want mobility that is quick, flexible and affordable.
          </p>
        </div>

        {/* 3 Problem Cards — Dark Teal surface with lime circular icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Too many choices */}
          <div className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/30 transition-all shadow-xl group">
            <div className="w-14 h-14 rounded-full bg-[#bef237] flex items-center justify-center text-slate-950 mb-6 shadow-lg shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
              <Search className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
              Too many choices
            </h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Finding the right rental across different providers takes time.
            </p>
          </div>

          {/* Card 2: Time pressure */}
          <div className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/30 transition-all shadow-xl group">
            <div className="w-14 h-14 rounded-full bg-[#bef237] flex items-center justify-center text-slate-950 mb-6 shadow-lg shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
              Time pressure
            </h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Users need a vehicle when they need it—not after long calls or searches.
            </p>
          </div>

          {/* Card 3: Price sensitivity */}
          <div className="bg-[#0e1c26] rounded-3xl p-8 border border-white/10 hover:border-[#bef237]/30 transition-all shadow-xl group">
            <div className="w-14 h-14 rounded-full bg-[#bef237] flex items-center justify-center text-slate-950 mb-6 shadow-lg shadow-[#bef237]/20 group-hover:scale-105 transition-transform">
              <span className="text-2xl font-black font-sans leading-none">₹</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
              Price sensitivity
            </h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Students, travellers and daily users want affordable rental options.
            </p>
          </div>

        </div>

        {/* Conclusion Banner from PDF Page 2 */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center gap-2 sm:gap-3 py-3 px-6 rounded-2xl bg-white/5 border border-white/10 text-sm sm:text-lg font-bold text-slate-200">
            <span>Rentro turns the <strong className="text-white">search</strong></span>
            <span className="text-[#bef237]">→</span>
            <span><strong className="text-white">booking</strong></span>
            <span className="text-[#bef237]">→</span>
            <span><strong className="text-white">ride</strong> journey into one simple experience.</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TheProblem;
