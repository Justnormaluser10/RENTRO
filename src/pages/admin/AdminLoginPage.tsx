import React, { useState } from 'react';
import { adminAuth } from '../../services/adminAuth';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Eye, EyeOff, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onExit: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onExit }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const isValid = await adminAuth.verifyPassword(password);
    setIsLoading(false);

    if (isValid) {
      adminAuth.createSession();
      onSuccess();
    } else {
      setError('Invalid admin credentials. Please enter the authorized fleet administrator password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Back to customer site */}
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Rentro Customer Website</span>
        </button>

        <div className="bg-[#11141e]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Fleet Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Authorized Ahmedabad operations staff and fleet managers only.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Administrator Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  autoFocus
                  className="w-full rounded-xl bg-slate-900/90 border border-slate-800 px-3.5 py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 py-3"
            >
              Sign In to Fleet Control
            </Button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-slate-800/80">
            Protected endpoint • Ahmedabad Operations Hub
          </div>
        </div>
      </div>
    </div>
  );
};
