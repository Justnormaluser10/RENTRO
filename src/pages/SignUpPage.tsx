import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, Check } from 'lucide-react';

interface SignUpPageProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onSuccess, onNavigateLogin }) => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    setIsLoading(true);

    const res = await signUp({
      fullName,
      email,
      phone,
      password,
    });

    setIsLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-[#0e111a] p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#111624] to-[#0a0d14] border border-white/15 text-white flex items-center justify-center mx-auto shadow-md">
            <span className="font-black text-2xl">R</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Create Your Rentro Account
          </h2>
          <p className="text-xs text-slate-400">
            Sign up in 30 seconds to book self-drive cars and bikes in Ahmedabad.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name (as per Driving Licence)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Mobile Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            required
          />

          <Input
            label="Create Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            required
          />

          <div className="text-xs text-slate-400 space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#00f2aa]" />
              <span>Must be at least 21 years old</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#00f2aa]" />
              <span>Valid Indian Driving Licence required at pickup</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-black text-sm bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-lg shadow-[#00f2aa]/20 transition-all cursor-pointer mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account & Get Started'}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-white/5 text-xs text-slate-400">
          Already have an account?{' '}
          <button
            onClick={onNavigateLogin}
            className="font-bold text-[#00f2aa] hover:underline cursor-pointer"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
