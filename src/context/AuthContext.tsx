import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_USER_CUSTOMER, DEMO_USER_ADMIN } from '../services/mockData';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: { email: string; fullName: string; phone?: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchUserRole: (targetRole: UserRole) => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'rentro_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : DEMO_USER_CUSTOMER;
    } catch {
      return DEMO_USER_CUSTOMER;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  }, [user]);

  // If Supabase is configured, listen to real auth changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              full_name: profile.full_name,
              email: session.user.email || '',
              phone: profile.phone,
              role: profile.role,
              dob: profile.dob,
              address: profile.address,
              avatar_url: profile.avatar_url,
              kyc_status: 'APPROVED',
            });
          }
        }
      } catch (err) {
        console.warn('Session check failed:', err);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            full_name: profile.full_name,
            email: session.user.email || '',
            phone: profile.phone,
            role: profile.role,
            dob: profile.dob,
            address: profile.address,
            avatar_url: profile.avatar_url,
            kyc_status: 'APPROVED',
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        setIsLoading(false);
        return { success: true };
      }

      // Demo login
      if (email.toLowerCase().includes('admin')) {
        setUser(DEMO_USER_ADMIN);
      } else {
        setUser({
          ...DEMO_USER_CUSTOMER,
          email,
          full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        });
      }
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signUp = async (data: { email: string; fullName: string; phone?: string; password?: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && data.password) {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              phone: data.phone,
            }
          }
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (authData.user) {
          // Profile trigger usually handles this, or create explicitly
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            full_name: data.fullName,
            phone: data.phone,
            role: 'customer',
          });
        }

        setIsLoading(false);
        return { success: true };
      }

      // Demo Signup
      const newUser: UserProfile = {
        id: 'usr-' + Date.now().toString(36),
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || '+91 98000 11111',
        role: 'customer',
        kyc_status: 'PENDING',
      };
      setUser(newUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Sign up failed' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const switchUserRole = (targetRole: UserRole) => {
    if (targetRole === 'admin') {
      setUser(DEMO_USER_ADMIN);
    } else {
      setUser(DEMO_USER_CUSTOMER);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    if (isSupabaseConfigured) {
      await supabase.from('profiles').update(data).eq('id', user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'customer',
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
        isLoading,
        login,
        signUp,
        logout,
        switchUserRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
