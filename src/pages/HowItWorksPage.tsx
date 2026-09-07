import React from 'react';
import { HowItWorks } from '../components/home/HowItWorks';
import { Button } from '../components/ui/Button';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CreditCard, 
  FileText, 
  Phone, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface HowItWorksPageProps {
  onBrowseVehicles: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onBrowseVehicles }) => {
  const hubs = [
    {
      name: 'S.G. Highway Mobility Hub',
      address: 'Bodakdev, Near ISCON Cross Road, SG Highway, Ahmedabad 380054',
      landmark: 'Opposite ISCON Mega Mall',
      phone: '+91 98765 43210',
      hours: '24 Hours Open (7 Days/Week)',
    },
    {
      name: 'Prahlad Nagar Mobility Hub',
      address: 'Corporate Road, Near Anand Nagar, Prahlad Nagar, Ahmedabad 380015',
      landmark: 'Near Titanium City Center',
      phone: '+91 98765 43211',
      hours: '6:00 AM – 11:30 PM (Daily)',
    },
    {
      name: 'SVPI Airport Hub (Ahmedabad)',
      address: 'Domestic Terminal Arrivals Pickup Zone B, Hansol, Ahmedabad 380047',
      landmark: 'Next to Airport Departure Deck',
      phone: '+91 98765 43212',
      hours: '24 Hours Open (Flight Arrivals)',
    },
    {
      name: 'Vastrapur & Satellite Hub',
      address: 'Near Ahmedabad One Mall, Vastrapur Lake Rd, Ahmedabad 380015',
      landmark: 'Near Vastrapur Lake Amphi-theatre',
      phone: '+91 98765 43213',
      hours: '7:00 AM – 11:00 PM (Daily)',
    },
  ];

  const faqs = [
    {
      q: 'What documents are required to rent a vehicle in Ahmedabad?',
      a: 'You need an original, valid physical Indian Driving Licence (LMV for four-wheelers, MCWG for motorcycles/scooters) and a government ID proof (Aadhaar or Voter ID). Digilocker documents are also accepted for digital verification.',
    },
    {
      q: 'How does the refundable security deposit work?',
      a: 'A minimal security deposit (₹1,000 for bikes, ₹2,000–₹5,000 for cars) is held during the trip. Upon returning the vehicle at the Ahmedabad hub, our staff performs a quick 90-second digital check and the deposit is initiated for instant refund back to your source account or UPI.',
    },
    {
      q: 'What is the fuel policy?',
      a: 'We operate on a transparent "Same-to-Same" fuel policy. The fuel or battery level at pickup is digitally logged on your inspection sheet. Simply return the vehicle with the same level, with zero hidden surge markups.',
    },
    {
      q: 'Can I drive outside Ahmedabad to Gandhinagar, GIFT City, or Udaipur?',
      a: 'Yes! Rentro vehicles have all-Gujarat & all-India permits. You are free to take road trips to GIFT City, Gandhinagar, Statue of Unity, Mount Abu, or Gir National Park. Fastag tolls and interstate taxes apply as per actual highway usage.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080c] text-white py-12 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#00f2aa] uppercase tracking-wider block">
            Self-Drive Made Effortless
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How Rentro Works
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            From booking your favorite car or bike to returning the keys at our Ahmedabad hubs, here is everything you need to know.
          </p>
        </div>

        {/* 4-Step Visual Flow */}
        <HowItWorks />

        {/* Ahmedabad Mobility Hubs */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-black text-white">
              Our Ahmedabad Pickup & Return Hubs
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Convenient hubs located across S.G. Highway, Prahlad Nagar, Vastrapur, and SVPI Airport.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hubs.map((hub, idx) => (
              <div key={idx} className="bg-[#0e111a] rounded-3xl p-6 border border-white/10 shadow-lg space-y-3 hover:border-[#00f2aa]/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#00f2aa]/10 border border-[#00f2aa]/20 text-[#00f2aa] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">{hub.name}</h3>
                <p className="text-xs text-slate-400">{hub.address}</p>
                <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#00f2aa]" />
                    <span>{hub.hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#00f2aa]" />
                    <span>{hub.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-black text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Clear, transparent answers for your self-drive rental in Ahmedabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#0e111a] rounded-3xl p-6 border border-white/10 shadow-lg space-y-2">
                <h3 className="font-bold text-white text-sm flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-[#00f2aa] shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8">
          <button
            onClick={onBrowseVehicles}
            className="inline-flex items-center gap-2 font-black px-8 py-3.5 rounded-2xl bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-xl shadow-[#00f2aa]/25 transition-all cursor-pointer text-sm"
          >
            <span>Explore Vehicles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
