import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/ui/Logo';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateSignUp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigateSignUp }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }
    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-7 bg-[#0e111a] p-8 rounded-3xl border border-white/10 shadow-2xl">
        
        {/* Header with Unified Brand Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to manage your self-drive bookings and vehicle pickups in Ahmedabad.
          </p>
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
            autoFocus
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
