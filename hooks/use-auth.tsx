'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { signIn as serverSignIn, signOut as serverSignOut, getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already authenticated
        const { data: currentUser } = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setProfile(currentUser);
        } else {
          // Check localStorage for stored user (fallback)
          const stored = localStorage.getItem('currentUser');
          if (stored) {
            const storedUser = JSON.parse(stored);
            setUser(storedUser);
            setProfile(storedUser);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('currentUser');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: currentUser } = await getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setProfile(currentUser);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          localStorage.removeItem('currentUser');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await serverSignIn(email, password);
      
      if (result.data?.user) {
        setUser(result.data.user);
        setProfile(result.data.user);
        localStorage.setItem('currentUser', JSON.stringify(result.data.user));
      }
      
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        data: null, 
        error: { message: 'Authentication failed' } 
      };
    }
  };

  const signOut = async () => {
    try {
      await serverSignOut();
      setUser(null);
      setProfile(null);
      localStorage.removeItem('currentUser');
      localStorage.clear();
      
      // Force redirect to login page
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  const contextValue = { user, profile, loading, signIn, signOut };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};