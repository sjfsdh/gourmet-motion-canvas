
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signOut: async () => {},
  isAdmin: false,
  setIsAdmin: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      setIsLoading(true);
      
      // Get current session
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      setUser(sessionData.session?.user ?? null);

      // Check if user is admin
      const adminToken = localStorage.getItem('adminToken');
      setIsAdmin(!!adminToken);
      
      setIsLoading(false);
    };

    initAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // If logging out, ensure we clear admin status too
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('adminToken');
        setIsAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    
    // If the user was an admin, clear the admin token
    if (isAdmin) {
      localStorage.removeItem('adminToken');
      setIsAdmin(false);
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signOut,
    isAdmin,
    setIsAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
