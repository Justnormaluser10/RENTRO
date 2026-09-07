import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (type: 'all' | 'car' | 'bike', category?: string, fuel?: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      title: 'Self-Drive Cars',
      subtitle: 'Hatchbacks & Sedans',
      type: 'car' as const,
      category: undefined,
      fuel: undefined,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      tag: 'From ₹150/hr',
    },
    {
      title: 'Bikes & Scooters',
      subtitle: 'Cruisers, Street & Activa',
      type: 'bike' as const,
      category: undefined,
      fuel: undefined,
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      tag: 'From ₹60/hr',
    },
    {
      title: 'SUVs & 4x4 Off-Road',
      subtitle: 'Rugged Highway & Getaway',
      type: 'car' as const,
      category: 'suv',
      fuel: undefined,
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
      tag: 'From ₹300/hr',
    },
    {
      title: '100% Electric Mobility',
      subtitle: 'Zero Emission City Drives',
      type: 'all' as const,
      category: undefined,
      fuel: 'electric',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      tag: 'Fast Charging',
    },
  ];

  return (
    <section className="py-24 bg-[#07080c] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#00f2aa] uppercase tracking-wider block">
            Diverse Ahmedabad Fleet
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Browse By Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Pick the perfect self-drive vehicle for city meetings on S.G. Highway, weekend trips to Thol Lake, or daily commuting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => onSelectCategory(cat.type, cat.category, cat.fuel)}
              className="group relative rounded-3xl overflow-hidden aspect-4/3 sm:aspect-3/4 border border-white/10 text-left focus:outline-none focus:ring-2 focus:ring-[#00f2aa] transition-all duration-300 hover:border-[#00f2aa]/50 hover:shadow-2xl hover:shadow-[#00f2aa]/5 hover:-translate-y-1 cursor-pointer bg-[#0e111a]"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/40 to-transparent" />

              <div className="absolute top-4 right-4 rounded-full bg-black/60 backdrop-blur-md p-2.5 text-white group-hover:bg-[#00f2aa] group-hover:text-slate-950 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                <span className="inline-block text-[10px] font-bold text-[#00f2aa] bg-black/70 border border-[#00f2aa]/30 px-2.5 py-0.5 rounded-full mb-1">
                  {cat.tag}
                </span>
                <h3 className="text-lg font-black text-white group-hover:text-[#00f2aa] transition-colors leading-tight">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-400">{cat.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
