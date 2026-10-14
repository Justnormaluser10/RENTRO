import React from 'react';

export const WhyRentro: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#080c14] text-white border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header — Match to PDF Page 6 */}
        <div className="max-w-3xl space-y-3 mb-10 sm:mb-14">
          <div className="text-xs sm:text-sm font-black text-[#bef237] tracking-[0.2em] font-mono uppercase">
            05 • WHY RENTRO
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            More than another rental app.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 font-normal">
            Position the brand around convenience, variety and local trust.
          </p>
        </div>

        {/* Prominent Lime-Green Quotation Panel — Exact match to PDF Page 6 */}
        <div className="mb-14 sm:mb-18">
          <div className="bg-[#bef237] text-slate-950 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-[#bef237]/15">
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              “The right vehicle, at the right time, at the right price.”
            </h3>
          </div>
        </div>

        {/* 4 Numbered Feature Cards — PDF Page 6 Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* 1. LOCAL-FIRST */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-[#bef237]/20">
              1
            </div>
            <div className="space-y-1.5 pt-0.5">
              <h4 className="text-lg font-black text-white uppercase tracking-wider">
                LOCAL-FIRST
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Start with Vadodara & Ahmedabad, then expand.
              </p>
            </div>
          </div>

          {/* 2. ALL-IN-ONE */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-[#bef237]/20">
              2
            </div>
            <div className="space-y-1.5 pt-0.5">
              <h4 className="text-lg font-black text-white uppercase tracking-wider">
                ALL-IN-ONE
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Bike + scooter + car + EV in one experience.
              </p>
            </div>
          </div>

          {/* 3. 24×7 SUPPORT */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-[#bef237]/20">
              3
            </div>
            <div className="space-y-1.5 pt-0.5">
              <h4 className="text-lg font-black text-white uppercase tracking-wider">
                24×7 SUPPORT
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Help when customers actually need it.
              </p>
            </div>
          </div>

          {/* 4. VALUE-LED */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-[#bef237]/20">
              4
            </div>
            <div className="space-y-1.5 pt-0.5">
              <h4 className="text-lg font-black text-white uppercase tracking-wider">
                VALUE-LED
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Affordable options without unnecessary complexity.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyRentro;
