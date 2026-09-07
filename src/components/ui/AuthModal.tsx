import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from './Input';
import { Logo } from './Logo';
import { X, Check, ShieldCheck, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicleName?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  vehicleName,
}) => {
  const { login, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Sign In fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password.');
      return;
    }
    setError(null);
    setIsLoading(true);

    const res = await login(loginEmail, loginPassword);
    setIsLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Invalid credentials. Please check and try again.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !signupEmail || !signupPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    setIsLoading(true);

    const res = await signUp({
      fullName,
      email: signupEmail,
      phone: signupPhone,
      password: signupPassword,
    });
    setIsLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0e111a] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00f2aa]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="flex justify-center">
            <Logo size="sm" showSubtitle={false} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'signin' ? 'Sign In to Reserve' : 'Create Account & Book'}
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {vehicleName ? (
              <span>Reserving <strong className="text-[#00f2aa]">{vehicleName}</strong> in Ahmedabad</span>
            ) : (
              'Quick login to complete your self-drive vehicle reservation.'
            )}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#141824] rounded-2xl border border-white/5 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'signin'
                ? 'bg-[#00f2aa] text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'signup'
                ? 'bg-[#00f2aa] text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 font-medium">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-lg shadow-[#00f2aa]/20 transition-all cursor-pointer disabled:opacity-50 mt-1"
            >
              {isLoading ? 'Signing In...' : 'Sign In & Continue Booking'}
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <Input
              label="Full Name (as on Driving Licence)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              autoFocus
            />

            <Input
              label="Email Address"
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Mobile Phone Number"
              value={signupPhone}
              onChange={(e) => setSignupPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
            />

            <Input
              label="Password"
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-lg shadow-[#00f2aa]/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Creating Account...' : 'Create Account & Continue'}
            </button>
          </form>
        )}

        {/* Security badge */}
        <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-white/5 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00f2aa]" />
          <span>Your session stays securely logged in on this browser.</span>
        </div>
      </div>
    </div>
  );
};
