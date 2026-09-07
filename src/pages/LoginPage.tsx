import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateSignUp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigateSignUp }) => {
  const { login, switchUserRole } = useAuth();
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleQuickDemoLogin = (role: 'customer' | 'admin') => {
    switchUserRole(role);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-7 bg-[#0e111a] p-8 rounded-3xl border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#111624] to-[#0a0d14] border border-white/15 text-white flex items-center justify-center mx-auto shadow-md">
            <span className="font-black text-2xl">R</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Welcome to Rentro
          </h2>
          <p className="text-xs text-slate-400">
            Log in to manage your self-drive bookings and vehicle pickups in Ahmedabad.
          </p>
        </div>

        {/* Quick Demo Credentials Box for Instant Testing */}
        <div className="rounded-2xl bg-[#141824] border border-white/10 p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00f2aa] block">
            ⚡ Quick 1-Click Customer Demo
          </span>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('customer')}
            className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-center cursor-pointer"
          >
            Instant Login as Driver (Rahul Sharma)
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-black text-sm bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-lg shadow-[#00f2aa]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="space-y-3 pt-2 border-t border-white/5 text-center text-xs text-slate-400">
          <div>
            Don't have an account yet?{' '}
            <button
              onClick={onNavigateSignUp}
              className="font-bold text-[#00f2aa] hover:underline cursor-pointer"
            >
              Create an Account
            </button>
          </div>
          <div>
            Fleet Staff?{' '}
            <a
              href="/admin/login"
              className="font-semibold text-slate-400 hover:text-white underline cursor-pointer"
            >
              Access Fleet Admin Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
