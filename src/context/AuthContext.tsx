// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface User {
  email: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  address: string;
  nationalId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userDetails: User) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const signUp = async (email: string, password: string, userDetails: User) => {
    setLoading(true);
    try {
      const { user, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      // Insert user details into the custom users table
      const { data, error: insertError } = await supabase.from('users').insert([userDetails]);
      if (insertError) throw insertError;

      toast.success('Registration successful! Please log in.');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Fetch additional user details
      const { data } = await supabase.from('users').select('*').eq('email', email).single();
      setUser(data); // Set user data
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Successfully logged out!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
