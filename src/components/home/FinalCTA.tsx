import React from 'react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onBrowse: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onBrowse }) => {
  return (
    <section className="relative overflow-hidden bg-[#080c14] text-white py-20 sm:py-28 border-b border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#bef237]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Official White Badge Logo — Matching PDF Page 10 */}
        <div className="inline-block">
          <Logo variant="badge" size="xl" showSubtitle={false} />
        </div>

        {/* Heading from PDF Page 10 */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Your next ride is one booking away.
        </h2>

        {/* Supporting text from PDF Page 10 */}
        <p className="text-base sm:text-xl text-slate-300 font-bold tracking-wide">
          24×7 service • Easy rentals • Affordable rates
        </p>

        {/* CTA Button — Lime-green button from PDF Page 10 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            size="lg"
            onClick={onBrowse}
            className="w-full sm:w-auto gap-2 text-sm sm:text-base font-black bg-[#bef237] hover:bg-[#a3e635] text-slate-950 shadow-2xl shadow-[#bef237]/30 px-10 py-4 rounded-2xl cursor-pointer"
          >
            <span>Explore All Rides & Book</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </Button>
        </div>

        {/* Launch footer tag */}
        <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bef237]"></span>
            Vadodara (Pilot)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bef237]"></span>
            Ahmedabad (Expansion)
          </span>
          <span>•</span>
          <span>Bikes • Scooters • Cars • EVs</span>
        </div>

      </div>
    </section>
  );
};

export default FinalCTA;
