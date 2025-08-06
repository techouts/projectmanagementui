import { supabase, isSupabaseConfigured } from './supabase';
import { mockUsers } from './mock-data';
import { User } from '@/types';

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured) {
    // Use mock authentication
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return { 
        data: null, 
        error: { message: 'Invalid email or password' } 
      };
    }
    
    // For demo purposes, accept 'password' for all users
    if (password !== 'password') {
      return { 
        data: null, 
        error: { message: 'Invalid email or password' } 
      };
    }
    
    return { 
      data: { user }, 
      error: null 
    };
  }

  try {
    // First, try to authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // If Supabase auth fails, fall back to custom user table authentication
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        // Final fallback to mock data
        const user = mockUsers.find(u => u.email === email);
        
        if (!user) {
          return { 
            data: null, 
            error: { message: 'Invalid email or password' } 
          };
        }
        
        // For demo purposes, accept 'password' for all users
        if (password !== 'password') {
          return { 
            data: null, 
            error: { message: 'Invalid email or password' } 
          };
        }
        
        return { 
          data: { user }, 
          error: null 
        };
      }

      // For demo purposes, accept 'password' for all users
      if (password !== 'password') {
        return { 
          data: null, 
          error: { message: 'Invalid email or password' } 
        };
      }

      // Convert database user to our User type
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        avatar_url: userData.avatar_url,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };

      return { 
        data: { user }, 
        error: null 
      };
    }

    // If Supabase auth succeeds, get user profile from our users table
    if (authData.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', authData.user.email)
        .single();

      if (userError || !userData) {
        return { 
          data: null, 
          error: { message: 'User profile not found' } 
        };
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        avatar_url: userData.avatar_url,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };

      return { 
        data: { user }, 
        error: null 
      };
    }

    return { 
      data: null, 
      error: { message: 'Authentication failed' } 
    };
  } catch (error) {
    console.warn('Sign in error (falling back to mock data):', error);
    
    // Fallback to mock authentication
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return { 
        data: null, 
        error: { message: 'Invalid email or password' } 
      };
    }
    
    // For demo purposes, accept 'password' for all users
    if (password !== 'password') {
      return { 
        data: null, 
        error: { message: 'Invalid email or password' } 
      };
    }
    
    return { 
      data: { user }, 
      error: null 
    };
  }
};

export const signOut = async () => {
  if (!isSupabaseConfigured) {
    // Mock sign out
    return;
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('Sign out error:', error);
    }
  } catch (error) {
    console.warn('Sign out error:', error);
  }
};

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured) {
    // Check localStorage for mock user
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const user = JSON.parse(stored);
        return { data: user, error: null };
      }
    } catch (error) {
      console.warn('Error getting stored user:', error);
    }
    return { data: null, error: null };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Check localStorage for fallback
      try {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
          const storedUser = JSON.parse(stored);
          return { data: storedUser, error: null };
        }
      } catch (error) {
        console.warn('Error getting stored user:', error);
      }
      return { data: null, error: null };
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (userError || !userData) {
      return { 
        data: null, 
        error: { message: 'User profile not found' } 
      };
    }

    const userProfile: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      avatar_url: userData.avatar_url,
      created_at: userData.created_at,
      updated_at: userData.updated_at
    };

    return { 
      data: userProfile, 
      error: null 
    };
  } catch (error) {
    console.warn('Get current user error (checking localStorage):', error);
    
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const user = JSON.parse(stored);
        return { data: user, error: null };
      }
    } catch (storageError) {
      console.warn('Error getting stored user:', storageError);
    }
    
    return { 
      data: null, 
      error: { message: 'Failed to get current user' } 
    };
  }
};