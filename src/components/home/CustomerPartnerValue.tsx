import React from 'react';
import { Check } from 'lucide-react';

export const CustomerPartnerValue: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#080c14] text-white border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header — Match to PDF Page 9 */}
        <div className="max-w-3xl space-y-3 mb-12 sm:mb-16">
          <div className="text-xs sm:text-sm font-black text-[#bef237] tracking-[0.2em] font-mono uppercase">
            08 • VALUE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Why customers—and partners—win.
          </h2>
        </div>

        {/* Two Columns — FOR CUSTOMERS vs FOR PARTNERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Column 1: FOR CUSTOMERS */}
          <div className="bg-[#0e1c26] rounded-3xl p-8 sm:p-10 border border-white/10 shadow-xl space-y-6">
            <h3 className="text-sm font-mono font-black text-[#bef237] uppercase tracking-widest pb-3 border-b border-white/10">
              FOR CUSTOMERS
            </h3>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-[#bef237]/20">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-base sm:text-lg font-bold text-white">
                  Convenient vehicle discovery
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-[#bef237]/20">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-base sm:text-lg font-bold text-white">
                  Choice across categories
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-[#bef237]/20">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-base sm:text-lg font-bold text-white">
                  Affordable rental options
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-[#bef237]/20">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-base sm:text-lg font-bold text-white">
                  Simple booking experience
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: FOR PARTNERS */}
          <div className="bg-[#0e1c26] rounded-3xl p-8 sm:p-10 border border-white/10 shadow-xl space-y-6">
            <h3 className="text-sm font-mono font-black text-[#bef237] uppercase tracking-widest pb-3 border-b border-white/10">
              FOR PARTNERS
            </h3>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-[#bef237]/20">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-base sm:text-lg font-bold text-white">
                  Reach more local customers
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-[#bef237]/20">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-base sm:text-lg font-bold text-white">
                  Improve vehicle utilization
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-[#bef237]/20">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-base sm:text-lg font-bold text-white">
                  Centralized digital presence
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#bef237] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-[#bef237]/20">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-base sm:text-lg font-bold text-white">
                  Scale city by city
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CustomerPartnerValue;
