import React from 'react';
import { Logo } from '../ui/Logo';
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
            <div className="w-10 h-10 rounded-xl bg-[#bef237]/10 border border-[#bef237]/20 flex items-center justify-center text-[#bef237] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">24×7 Service Promise</h4>
              <p className="text-xs text-slate-400 mt-1">Built for real-life schedules across Vadodara and Ahmedabad with easy rentals.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#bef237]/10 border border-[#bef237]/20 flex items-center justify-center text-[#bef237] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Self-Drive</h4>
              <p className="text-xs text-slate-400 mt-1">Multi-point safety inspected, sanitised, and serviced before handover. Zero chauffeurs.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#bef237]/10 border border-[#bef237]/20 flex items-center justify-center text-[#bef237] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Transparent Rates</h4>
              <p className="text-xs text-slate-400 mt-1">The right vehicle, at the right time, at the right price. Zero hidden deductions.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#bef237]/10 border border-[#bef237]/20 flex items-center justify-center text-[#bef237] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Multiple Vehicle Types</h4>
              <p className="text-xs text-slate-400 mt-1">Bikes, Scooters, Cars, and EVs in one unified application experience.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12 border-b border-white/5">
          <div className="md:col-span-2 space-y-4">
            <Logo onClick={() => navigate('/')} />
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              RENT SMART. RIDE FREE. One app for every ride you need. Self-drive mobility built for Gujarat's premier hubs.
            </p>
            <div className="text-xs text-slate-400 space-y-2 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#bef237] shrink-0 mt-0.5" />
                <span>Vadodara (Pilot Market) & Ahmedabad (Expansion Market), Gujarat</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#bef237] shrink-0" />
                <span>+91 98765 43210 (Support Channel)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#bef237] shrink-0" />
                <span>support@rentro.in</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">What You Can Rent</h5>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => navigate('/vehicles')} className="hover:text-white transition-colors cursor-pointer">Bikes (City-Friendly)</button></li>
              <li><button onClick={() => navigate('/vehicles')} className="hover:text-white transition-colors cursor-pointer">Scooters (Everyday Mobility)</button></li>
              <li><button onClick={() => navigate('/vehicles')} className="hover:text-white transition-colors cursor-pointer">Cars (Hatch, Sedan & SUV)</button></li>
              <li><button onClick={() => navigate('/vehicles')} className="hover:text-white transition-colors cursor-pointer">EVs (Modern & Future-Ready)</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Launch Hubs</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="text-[#bef237] font-semibold">Vadodara (Pilot Market)</li>
              <li>• Alkapuri & R.C. Dutt Road Hub</li>
              <li>• Sayajigunj & Station Hub</li>
              <li>• Gotri & Vasna-Bhayli Hub</li>
              <li className="text-[#bef237] font-semibold pt-1">Ahmedabad (Expansion)</li>
              <li>• S.G. Highway Hub (Bodakdev)</li>
              <li>• Prahlad Nagar • Vastrapur • Airport</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Platform</h5>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors cursor-pointer">How It Works (4 Steps)</button></li>
              <li><button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors cursor-pointer">My Bookings</button></li>
              <li><button onClick={() => navigate('/admin/login')} className="hover:text-[#bef237] transition-colors cursor-pointer">Fleet Admin Login</button></li>
              <li><span className="text-slate-600">Privacy Policy</span></li>
              <li><span className="text-slate-600">Rental Terms & Conditions</span></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Rentro Mobility Technologies Pvt. Ltd. Vadodara & Ahmedabad, Gujarat. All rights reserved.</p>
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

export default Footer;
