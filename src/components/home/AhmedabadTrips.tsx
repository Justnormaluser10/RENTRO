import React, { useState } from 'react';
import { AHMEDABAD_TRIPS, AhmedabadTrip } from '../../services/mockData';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Compass, MapPin, Clock, Car, ArrowRight, Sparkles } from 'lucide-react';

interface AhmedabadTripsProps {
  onPlanTrip: (trip: AhmedabadTrip) => void;
}

export const AhmedabadTrips: React.FC<AhmedabadTripsProps> = ({ onPlanTrip }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Urban Landmark', 'Scenic Getaway', 'Heritage', 'Architecture'];

  const filteredTrips = selectedCategory === 'all'
    ? AHMEDABAD_TRIPS
    : AHMEDABAD_TRIPS.filter((t) => t.category === selectedCategory);

  return (
    <section className="py-24 bg-[#090b12] border-b border-white/5 relative overflow-hidden">
      {/* Subtle background blur accent */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#00f2aa]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#00f2aa]/10 border border-[#00f2aa]/25 px-3.5 py-1 text-xs font-bold text-[#00f2aa]">
              <Compass className="w-3.5 h-3.5" />
              <span>Self-Drive Road Trip Inspiration</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Explore Ahmedabad with Rentro
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              From the tranquil sunset breezes of the Sabarmati Riverfront to early morning birdwatching drives at Thol Lake, take the wheel and explore Gujarat's premier metropolis.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#121623] rounded-2xl border border-white/10 self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                  selectedCategory === cat
                    ? 'bg-[#00f2aa] text-slate-950 font-black shadow-md shadow-[#00f2aa]/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Destinations' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Trips Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="group bg-[#111522] rounded-3xl border border-white/10 overflow-hidden hover:border-[#00f2aa]/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#00f2aa]/5 hover:-translate-y-1"
            >
              {/* Image Banner */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900">
                <img
                  src={trip.imageUrl}
                  alt={trip.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111522] via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="bg-[#07080c]/80 backdrop-blur-md text-[#00f2aa] border border-[#00f2aa]/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {trip.category}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 text-[11px] font-bold text-white bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#00f2aa]" />
                  <span>{trip.driveTime}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#00f2aa] shrink-0" />
                    <span className="truncate">{trip.area}</span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-[#00f2aa] transition-colors leading-tight">
                    {trip.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {trip.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Approx Distance:</span>
                    <span className="text-slate-300 font-bold">{trip.distanceFromHub}</span>
                  </div>

                  <button
                    onClick={() => onPlanTrip(trip)}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-[#00f2aa] text-white hover:text-slate-950 border border-white/10 hover:border-transparent font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer group-hover:bg-[#00f2aa] group-hover:text-slate-950"
                  >
                    <span>Plan Your Ride</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Local Guide Tip Bar */}
        <div className="mt-12 p-4 rounded-2xl bg-[#111522] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00f2aa] shrink-0" />
            <span>
              All destinations have convenient parking access. Recommended vehicles: automatic hatchbacks for Old Heritage City, or SUVs for Thol Lake and Nal Sarovar.
            </span>
          </div>

          <a
            href="https://wa.me/919876543210?text=Hi%20Rentro,%20I%20want%20to%20plan%20a%20self-drive%20trip%20in%20Ahmedabad"
            target="_blank"
            rel="noreferrer"
            className="text-[#00f2aa] hover:underline font-bold shrink-0 whitespace-nowrap"
          >
            Ask for Route Advice on WhatsApp →
          </a>
        </div>

      </div>
    </section>
  );
};
