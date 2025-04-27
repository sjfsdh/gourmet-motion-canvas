
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CustomButton } from '@/components/ui/custom-button';

interface LoginFormProps {
  switchToSignup?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Here we would typically connect to a real authentication API
    // For now, we'll simulate a login process with a timeout
    
    setTimeout(() => {
      // Mock successful login
      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({ name: 'John Doe', email }));
      
      setIsLoading(false);
      toast({
        title: "Login successful!",
        description: "Welcome back to DistinctGyrro",
      });
      
      navigate('/');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to continue to DistinctGyrro</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Email"
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-restaurant-green focus:ring-restaurant-green border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="text-restaurant-green hover:text-restaurant-green/80">
              Forgot password?
            </a>
          </div>
        </div>

        <div>
          <CustomButton
            type="submit"
            className="w-full justify-center"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </CustomButton>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={switchToSignup}
              className="text-restaurant-green hover:text-restaurant-green/80 font-medium"
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
