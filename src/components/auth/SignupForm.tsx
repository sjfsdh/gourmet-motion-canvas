
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SignupFormProps {
  switchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ switchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data) {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
        
        // Switch to login so the user can sign in after verifying their email
        switchToLogin();
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Could not create your account. Please try again.",
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
      <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Create Account</h2>
      <p className="text-gray-600 mb-6 text-center">Join our community of food lovers</p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <User size={18} />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green transition-all"
            />
          </div>

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

        <CustomButton type="submit" className="w-full justify-center" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Create Account'}
        </CustomButton>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-restaurant-green hover:underline font-semibold"
            >
              Log In
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default SignupForm;
