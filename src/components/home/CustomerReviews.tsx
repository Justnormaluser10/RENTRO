import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const testimonials = [
    {
      name: 'Bhavik Patel',
      role: 'Architect, Bodakdev',
      vehicle: 'Hyundai Creta SX',
      rating: 5,
      date: 'Aug 2026',
      content:
        'Rented the Creta for a weekend family drive to the Polo Forest. Handover at the SG Highway Hub took literally 90 seconds. The car was spotless, fuel was full, and returning on Sunday night was completely frictionless.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Riddhi Shah',
      role: 'Product Designer, Prahlad Nagar',
      vehicle: 'Royal Enfield Classic 350',
      rating: 5,
      date: 'Aug 2026',
      content:
        'The best self-drive experience in Ahmedabad by far. Transparent hourly pricing with zero nonsense extra fees. The RE Classic was in mint condition and made our Sunday sunrise cruise along Sabarmati Riverfront unforgettable.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Harshil Mehta',
      role: 'Tech Founder, Vastrapur',
      vehicle: 'Tata Nexon EV',
      rating: 5,
      date: 'Jul 2026',
      content:
        'First time driving an EV and Rentro made it super convenient. Picked up from Vastrapur Hub, drove across Gandhinagar and GIFT City seamlessly. Security deposit was refunded directly to my UPI within 2 hours after return.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    },
  ];

  return (
    <section className="py-24 bg-[#07080c] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#00f2aa] uppercase tracking-wider block">
            Ahmedabad Driver Stories
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Customer Reviews
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real experiences from Ahmedabad locals and travellers exploring Gujarat with Rentro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-[#0e111a] border border-white/10 p-7 hover:border-[#00f2aa]/40 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#00f2aa]/5 group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-slate-500">{review.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6 font-normal">
                  "{review.content}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-5 border-t border-white/5">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-white/10"
                />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{review.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-[#00f2aa]" />
                  </div>
                  <span className="text-[11px] text-slate-400 block">{review.role}</span>
                  <span className="text-[10px] text-[#00f2aa] font-semibold block">
                    Drove {review.vehicle}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
