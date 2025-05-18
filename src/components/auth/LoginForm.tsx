
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  switchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setIsAdmin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in the user with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data) {
        console.log("Login successful", data);
        
        // For demo purposes, check if this is the admin user
        if (email === 'admin@example.com') {
          localStorage.setItem('adminToken', 'mock-jwt-admin-token');
          localStorage.setItem('adminUser', JSON.stringify({ 
            name: 'Admin User', 
            email: 'admin@example.com',
            role: 'Administrator'
          }));
          setIsAdmin(true);
        }
        
        toast({
          title: "Login successful!",
          description: "Welcome back!",
        });
        
        // Save user data to localStorage for demo
        localStorage.setItem('user', JSON.stringify({
          name: data.user?.user_metadata?.full_name || email.split('@')[0],
          email: email,
          id: data.user?.id
        }));
        
        // Redirect to the home page
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Please check your inbox for instructions to reset your password",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Welcome Back</h2>
      <p className="text-gray-600 mb-6 text-center">Sign in to your account</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <button 
            type="button" 
            onClick={handleForgotPassword}
            className="text-sm text-restaurant-green hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <CustomButton type="submit" className="w-full justify-center" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </CustomButton>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={switchToSignup}
              className="text-restaurant-green hover:underline font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;
