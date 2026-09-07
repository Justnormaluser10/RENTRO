import React from 'react';
import { Shield, Clock, Award, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#050609] text-slate-400 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#00f2aa]/10 border border-[#00f2aa]/20 flex items-center justify-center text-[#00f2aa] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Flexible Rentals</h4>
              <p className="text-xs text-slate-400 mt-1">Rent by 1 hour, 6 hours, 1 day, or weeks across Ahmedabad with instant extensions.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#00f2aa]/10 border border-[#00f2aa]/20 flex items-center justify-center text-[#00f2aa] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Self-Drive</h4>
              <p className="text-xs text-slate-400 mt-1">Multi-point safety inspected, sanitised, and serviced before every drive. Zero chauffeurs.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#00f2aa]/10 border border-[#00f2aa]/20 flex items-center justify-center text-[#00f2aa] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Transparent Rates</h4>
              <p className="text-xs text-slate-400 mt-1">Zero hidden charges or surprise surge. Transparent breakdown of rental, deposit, and GST.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#00f2aa]/10 border border-[#00f2aa]/20 flex items-center justify-center text-[#00f2aa] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Instant Ahmedabad Hubs</h4>
              <p className="text-xs text-slate-400 mt-1">Pick up directly from S.G. Highway, Prahlad Nagar, Vastrapur, or Airport Hubs.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12 border-b border-white/5">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#111624] to-[#0a0d14] border border-white/15 flex items-center justify-center text-white font-black text-base shadow-md">
                R
              </div>
              <span className="text-xl font-black tracking-tight text-white">RENTRO</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Your ride. Your time. Premium self-drive car and bike rentals designed for Ahmedabad commuters, weekend travellers, and road trippers.
            </p>
            <div className="text-xs text-slate-400 space-y-2 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#00f2aa] shrink-0 mt-0.5" />
                <span>Bodakdev, Near ISCON Cross Road, S.G. Highway, Ahmedabad, Gujarat 380054</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00f2aa] shrink-0" />
                <span>+91 98765 43210 (24x7 Ahmedabad Roadside Support)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00f2aa] shrink-0" />
                <span>support@rentro.in</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Self-Drive Vehicles</h5>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => navigate('/vehicles')} className="hover:text-white transition-colors cursor-pointer">Self-Drive Cars</button></li>
              <li><button onClick={() => navigate('/vehicles')} className="hover:text-white transition-colors cursor-pointer">Self-Drive Bikes</button></li>
              <li><button onClick={() => navigate('/vehicles')} className="hover:text-white transition-colors cursor-pointer">SUVs & 4x4 Off-Road</button></li>
              <li><button onClick={() => navigate('/vehicles')} className="hover:text-white transition-colors cursor-pointer">Electric Vehicles (EV)</button></li>
              <li><button onClick={() => navigate('/vehicles')} className="hover:text-white transition-colors cursor-pointer">City Hatchbacks & Sedans</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Ahmedabad Hubs</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>S.G. Highway Hub (Bodakdev)</li>
              <li>Prahlad Nagar Hub</li>
              <li>Vastrapur & Satellite Hub</li>
              <li>Navrangpura / C.G. Road Hub</li>
              <li>SVPI Airport Hub (24x7)</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Platform</h5>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors cursor-pointer">How It Works</button></li>
              <li><button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors cursor-pointer">My Bookings</button></li>
              <li><button onClick={() => navigate('/admin/login')} className="hover:text-[#00f2aa] transition-colors cursor-pointer">Fleet Admin Login</button></li>
              <li><span className="text-slate-600">Privacy Policy</span></li>
              <li><span className="text-slate-600">Rental Terms & Conditions</span></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Rentro Mobility Technologies Pvt. Ltd. Ahmedabad, Gujarat. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Security Deposit 100% Refundable</span>
            <span>•</span>
            <span>Razorpay Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
