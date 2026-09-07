import React from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';

interface FinalCTAProps {
  onBrowse: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onBrowse }) => {
  return (
    <section className="relative overflow-hidden bg-[#07080c] text-white py-24 border-b border-white/5">
      {/* Glow Orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#00f2aa]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-7">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1 text-xs font-bold text-[#00f2aa]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ahmedabad's Premier Self-Drive Mobility Network</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Ready to hit the road?
        </h2>

        <p className="text-sm sm:text-lg text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
          Pick your favourite car or bike, book your hours, upload your licence, and take the wheel in Ahmedabad in minutes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button
            size="lg"
            onClick={onBrowse}
            className="gap-2 text-sm sm:text-base font-bold bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-xl shadow-[#00f2aa]/25 px-8 py-3 rounded-2xl cursor-pointer"
          >
            <span>Browse Vehicles</span>
            <ArrowRight className="w-5 h-5" />
          </Button>

          <a
            href="https://wa.me/919876543210?text=Hi%20Rentro,%20I'm%20ready%20to%20book%20a%20self-drive%20ride%20in%20Ahmedabad"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/15 font-bold text-sm sm:text-base transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 text-[#00f2aa]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400">
          <span>✓ Zero Security Deduction Drama</span>
          <span>✓ 100% Verified Fleet</span>
          <span>✓ Same-to-Same Fuel Policy</span>
        </div>
      </div>
    </section>
  );
};
