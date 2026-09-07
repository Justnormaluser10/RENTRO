import React from 'react';
import { Clock, ShieldCheck, Receipt, Zap } from 'lucide-react';

export const WhyRentro: React.FC = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Flexible Rentals',
      description: 'Rent for 1 hour, 6 hours, 1 day, or multiple weeks across Ahmedabad. Drive strictly on your schedule.',
      highlight: 'From 1 hour',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Vehicles',
      description: 'Every car and bike undergoes a strict 50-point inspection, periodic servicing, and sanitization before handover.',
      highlight: '100% Inspected',
    },
    {
      icon: Receipt,
      title: 'Transparent Pricing',
      description: 'See your complete price breakdown before you pay. Zero surge pricing, no unexpected deductions.',
      highlight: 'Zero Hidden Fees',
    },
    {
      icon: Zap,
      title: 'Easy Booking',
      description: 'Choose your vehicle → Verify license → Pay securely → Pick up at your nearest Ahmedabad hub in minutes.',
      highlight: 'Choose → Book → Drive',
    },
  ];

  return (
    <section className="py-24 bg-[#07080c] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#00f2aa] uppercase tracking-wider block">
            The Rentro Difference
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Why Rentro?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            We built Rentro around radical simplicity and driver freedom. Real self-drive mobility, zero friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative rounded-3xl border border-white/10 bg-[#0e111a] p-7 hover:border-[#00f2aa]/40 hover:shadow-xl hover:shadow-[#00f2aa]/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#00f2aa]/10 border border-[#00f2aa]/20 text-[#00f2aa] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                
                <span className="inline-block text-[10px] font-bold text-[#00f2aa] bg-[#00f2aa]/10 border border-[#00f2aa]/25 px-2.5 py-0.5 rounded-full mb-3 uppercase tracking-wider">
                  {item.highlight}
                </span>

                <h3 className="text-lg font-black text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
