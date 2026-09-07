import React from 'react';
import { Car, Calendar, FileCheck, KeyRound } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: Car,
      title: 'Choose your vehicle',
      description: 'Select from verified self-drive hatchbacks, executive sedans, rugged SUVs, cruisers, or automatic scooters.',
    },
    {
      number: '02',
      icon: Calendar,
      title: 'Select rental duration',
      description: 'Choose 1 hour, 6 hours, 1 day, or custom multi-day schedules with real-time transparent pricing.',
    },
    {
      number: '03',
      icon: FileCheck,
      title: 'Verify and pay',
      description: 'Upload your driving licence once for quick staff review and complete your booking via Razorpay.',
    },
    {
      number: '04',
      icon: KeyRound,
      title: 'Pick up and drive',
      description: 'Walk in to your nearest Ahmedabad hub, conduct a 2-minute digital inspection, grab the keys, and drive away!',
    },
  ];

  return (
    <section className="py-24 bg-[#090b12] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#00f2aa] uppercase tracking-wider block">
            Seamless Self-Drive Mobility
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Zero endless dealership paperwork or hidden security deductions. Four straightforward steps to get you on Ahmedabad roads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative rounded-3xl bg-[#111420] border border-white/10 p-7 flex flex-col justify-between hover:border-[#00f2aa]/40 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-4xl font-black text-[#00f2aa]/40 font-mono group-hover:text-[#00f2aa] transition-colors">
                      {step.number}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-[#00f2aa] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
