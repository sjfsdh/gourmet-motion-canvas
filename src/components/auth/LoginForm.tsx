
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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
        // Check if the user is an admin
        const isAdmin = localStorage.getItem('adminToken') !== null;
        
        toast({
          title: "Login successful!",
          description: "Welcome back!",
        });
        
        // Redirect to the appropriate page
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
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
          <a href="#" className="text-sm text-restaurant-green hover:underline">
            Forgot Password?
          </a>
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
