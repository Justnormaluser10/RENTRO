import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  // Website opens directly as GUEST (user === null).
  // Restores from localStorage ONLY if a real user previously authenticated.
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure no legacy demo user persists in storage
        if (parsed?.email?.includes('hardik') || parsed?.full_name?.includes('Hardik')) {
          localStorage.removeItem(LOCAL_USER_KEY);
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync user changes to localStorage for persistent session
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  }, [user]);

  // If Supabase is configured, listen to real session and auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          let profileData: Partial<UserProfile> | null = null;
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile) {
              profileData = profile;
            }
          } catch (profileErr) {
            console.warn('Profile fetch warning (using auth metadata fallback):', profileErr);
          }

          const resolvedUser: UserProfile = {
            id: session.user.id,
            full_name: profileData?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Customer',
            email: session.user.email || '',
            phone: profileData?.phone || session.user.user_metadata?.phone || '',
            role: profileData?.role || 'customer',
            dob: profileData?.dob,
            address: profileData?.address,
            avatar_url: profileData?.avatar_url,
            kyc_status: profileData?.kyc_status || 'PENDING',
          };
          setUser(resolvedUser);
        }
      } catch (err) {
        console.warn('Session check failed:', err);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        let profileData: Partial<UserProfile> | null = null;
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile) {
            profileData = profile;
          }
        } catch {
          // fallback to auth metadata
        }

        const resolvedUser: UserProfile = {
          id: session.user.id,
          full_name: profileData?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Customer',
          email: session.user.email || '',
          phone: profileData?.phone || session.user.user_metadata?.phone || '',
          role: profileData?.role || 'customer',
          dob: profileData?.dob,
          address: profileData?.address,
          avatar_url: profileData?.avatar_url,
          kyc_status: profileData?.kyc_status || 'PENDING',
        };
        setUser(resolvedUser);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem(LOCAL_USER_KEY);
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
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const resolvedUser: UserProfile = {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0] || 'Customer',
            email: data.user.email || email,
            phone: data.user.user_metadata?.phone || '',
            role: 'customer',
            kyc_status: 'PENDING',
          };
          setUser(resolvedUser);
        }

        setIsLoading(false);
        return { success: true };
      }

      // Clean local authentication with user's actual entered email (no fake Hardik identity)
      const namePart = email.split('@')[0];
      const formattedName = namePart
        .split(/[._-]/)
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(' ');

      const localUser: UserProfile = {
        id: 'usr-' + Date.now().toString(36),
        full_name: formattedName || 'Customer',
        email: email.trim(),
        phone: '+91 98000 00000',
        role: 'customer',
        kyc_status: 'PENDING',
      };

      setUser(localUser);
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
          try {
            await supabase.from('profiles').upsert({
              id: authData.user.id,
              full_name: data.fullName,
              phone: data.phone,
              role: 'customer',
            });
          } catch {
            // Profile upsert fallback
          }

          const newUser: UserProfile = {
            id: authData.user.id,
            full_name: data.fullName,
            email: data.email,
            phone: data.phone || '',
            role: 'customer',
            kyc_status: 'PENDING',
          };
          setUser(newUser);
        }

        setIsLoading(false);
        return { success: true };
      }

      // Local Signup with user's actual entered data
      const newUser: UserProfile = {
        id: 'usr-' + Date.now().toString(36),
        full_name: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || '+91 98000 00000',
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
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Logout warning:', err);
    }
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
  };

  const switchUserRole = (targetRole: UserRole) => {
    if (user) {
      setUser({ ...user, role: targetRole });
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').update(data).eq('id', user.id);
      } catch (err) {
        console.warn('Profile update warning:', err);
      }
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
