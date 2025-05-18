
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
      console.log("Auth state changed:", event, newSession?.user?.email);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // If logging out, ensure we clear admin status too
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('adminToken');
        setIsAdmin(false);
      }
      
      // Special handling for admin@example.com login
      if (event === 'SIGNED_IN' && newSession?.user?.email === 'admin@example.com') {
        console.log("Admin user signed in");
        localStorage.setItem('adminToken', 'mock-jwt-admin-token');
        localStorage.setItem('adminUser', JSON.stringify({ 
          name: 'Admin User', 
          email: 'admin@example.com',
          role: 'Administrator'
        }));
        setIsAdmin(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      // If the user was an admin, clear the admin token
      if (isAdmin) {
        localStorage.removeItem('adminToken');
        setIsAdmin(false);
      }
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out from your account",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
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
