import React from 'react';
import { SearchWidget } from './SearchWidget';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { ArrowRight, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onSearch: () => void;
  onBrowse: () => void;
  onExploreAhmedabad: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onBrowse, onExploreAhmedabad }) => {
  return (
    <section className="relative overflow-hidden bg-[#080c14] text-white pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-white/5">
      {/* Background ambient lighting effects matching PDF dark minimalist tone */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#bef237]/8 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Hero Content — Exact wording and hierarchy from PDF Page 1 */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Tagline from PDF Page 1 */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs sm:text-sm font-black text-[#bef237] tracking-widest font-mono uppercase">
              <span className="w-2 h-2 rounded-full bg-[#bef237] animate-pulse" />
              RENT SMART. RIDE FREE.
            </div>

            {/* Main Headline from PDF Page 1 */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.06]">
              One app for every <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bef237] via-lime-200 to-white">
                ride you need.
              </span>
            </h1>

            {/* Vehicle Categories Subtitle from PDF Page 1 */}
            <p className="text-lg sm:text-2xl text-slate-300 font-bold tracking-wide">
              Bike • Scooter • Car • EV
            </p>

            {/* Launch Positioning Pill from PDF Page 1 */}
            <div>
              <div className="inline-flex items-center gap-2.5 bg-[#bef237] text-slate-950 font-black px-4 sm:px-5 py-2 rounded-2xl shadow-lg shadow-[#bef237]/20 text-xs sm:text-sm">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                <span>Launching: Vadodara + Ahmedabad</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl font-normal leading-relaxed pt-1">
              Rentro turns the search → booking → ride journey into one seamless self-drive experience with 24×7 service, transparent rates, and real fleet availability.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                onClick={onBrowse}
                className="gap-2 font-black bg-[#bef237] hover:bg-[#a3e635] text-slate-950 shadow-xl shadow-[#bef237]/25 text-sm sm:text-base px-8 py-3.5 rounded-2xl cursor-pointer"
              >
                <span>Find Your Ride</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onExploreAhmedabad}
                className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/30 text-sm sm:text-base px-6 py-3.5 rounded-2xl cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#bef237] mr-1.5" />
                Ahmedabad Geospatial Map
              </Button>
            </div>

            {/* Service Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
              <div>
                <span className="text-xl sm:text-2xl font-black text-white block">24×7</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Service Promise</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#bef237] block">4 Categories</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Bike • Scooter • Car • EV</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white block">2 Cities</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Vadodara + Ahmd</span>
              </div>
            </div>
          </div>

          {/* Right Brand Showcase Card — Featuring Official Logo Badge from PDF Page 1 */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-[#0e1724]/90 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 text-center">
              
              {/* The Official White Squircle Logo Badge from PDF Page 1 */}
              <div className="pt-2">
                <Logo variant="badge" size="lg" showSubtitle={false} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#bef237] block">
                  Official Launch Platform
                </span>
                <h3 className="text-xl font-black text-white">
                  Self-Drive Freedom Reimagined
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Simple. Fast. Local. Book verified cars, bikes, scooters, and EVs across Gujarat's premier hubs.
                </p>
              </div>

              {/* Status pills */}
              <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-white/5">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block font-mono">Pilot City</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#bef237]"></span>
                    Vadodara
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block font-mono">Expansion City</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#bef237]"></span>
                    Ahmedabad
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Embedded Search Widget */}
        <div className="mt-12 sm:mt-16">
          <SearchWidget onSearch={onSearch} />
        </div>

      </div>
    </section>
  );
};

export default Hero;
