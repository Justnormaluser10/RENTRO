import React from 'react';
import { SearchWidget } from './SearchWidget';
import { Button } from '../ui/Button';
import { ShieldCheck, Key, ArrowRight, MapPin, Sparkles } from 'lucide-react';

interface HeroProps {
  onSearch: () => void;
  onBrowse: () => void;
  onExploreAhmedabad: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onBrowse, onExploreAhmedabad }) => {
  return (
    <section className="relative overflow-hidden bg-[#07080c] text-white pt-10 pb-20 sm:pb-28 border-b border-white/5">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00f2aa]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-xs font-bold text-[#00f2aa]">
              <span className="w-2 h-2 rounded-full bg-[#00f2aa] animate-pulse"></span>
              Ahmedabad’s Premier Self-Drive Mobility Platform
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Your Ride. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2aa] via-teal-300 to-cyan-400">
                Your City.
              </span> <br />
              Your Way.
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Premium self-drive cars & bikes, available across Ahmedabad. Rent by the hour, day, or week with zero chauffeur friction, transparent rates, and instant hub pickups.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                onClick={onBrowse}
                className="gap-2 font-bold bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-lg shadow-[#00f2aa]/25 text-sm sm:text-base px-7 py-3 rounded-2xl"
              >
                <span>Explore Vehicles</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onExploreAhmedabad}
                className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/30 text-sm sm:text-base px-6 py-3 rounded-2xl"
              >
                Explore Ahmedabad
              </Button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
              <div>
                <span className="text-2xl font-black text-white block">5 Hubs</span>
                <span className="text-[11px] text-slate-400">Across Ahmedabad</span>
              </div>
              <div>
                <span className="text-2xl font-black text-white block">100%</span>
                <span className="text-[11px] text-slate-400">Self-Drive Freedom</span>
              </div>
              <div>
                <span className="text-2xl font-black text-[#00f2aa] block">Zero Surge</span>
                <span className="text-[11px] text-slate-400">Transparent Pricing</span>
              </div>
            </div>
          </div>

          {/* Right Luxury Automotive Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#11141e] aspect-4/3 sm:aspect-16/11 group">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                alt="Rentro Ahmedabad Self-Drive Fleet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-transparent to-transparent" />
              
              {/* Floating futuristic status pill */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-[#0e111a]/85 backdrop-blur-xl p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#00f2aa]/15 text-[#00f2aa] flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">100% Self-Drive Only</span>
                    <span className="text-[10px] text-slate-400 block">No driver • You take the wheel</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#00f2aa] bg-[#00f2aa]/10 border border-[#00f2aa]/30 px-2.5 py-1 rounded-lg">
                  Ahmedabad
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Embedded Search Widget */}
        <div className="mt-14 sm:mt-18">
          <SearchWidget onSearch={onSearch} />
        </div>

      </div>
    </section>
  );
};
