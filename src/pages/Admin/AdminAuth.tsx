
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CustomButton } from '@/components/ui/custom-button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog';

const AdminAuth = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, setIsAdmin } = useAuth();

  // Check if already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsAdmin(true);
      navigate('/admin');
    }
  }, [navigate, setIsAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Attempting to sign in with:", email, "password length:", password.length);
      
      // Sign in with Supabase first to get authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Auth error:", authError);
        setErrorMessage(authError.message || "Invalid login credentials");
        setShowErrorDialog(true);
        throw authError;
      }
      
      console.log("Auth success:", authData);
      
      // This is a mock admin check. In a real app, you would check against a roles table
      if (email === 'admin@example.com' && password === 'admin123') {
        console.log("Admin credentials verified");
        localStorage.setItem('adminToken', 'mock-jwt-admin-token');
        localStorage.setItem('adminUser', JSON.stringify({ 
          name: 'Admin User', 
          email: 'admin@example.com',
          role: 'Administrator'
        }));
        
        // Set isAdmin state to trigger proper redirect
        setIsAdmin(true);
        
        toast({
          title: "Admin login successful!",
          description: "Welcome to the admin dashboard",
        });
        
        navigate('/admin');
      } else {
        console.log("Not admin credentials");
        setErrorMessage("Invalid admin credentials. Please use admin@example.com and admin123");
        setShowErrorDialog(true);
        
        // Clear any existing admin token if login fails
        localStorage.removeItem('adminToken');
        setIsAdmin(false);
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      
      // Clear any existing admin token if login fails
      localStorage.removeItem('adminToken');
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const closeErrorDialog = () => {
    setShowErrorDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-6">
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
                placeholder="Admin Email"
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
              <button 
                type="button" 
                className="text-restaurant-green hover:text-restaurant-green/80"
                onClick={() => {
                  toast({
                    title: "Credentials reminder",
                    description: "Email: admin@example.com, Password: admin123",
                  });
                }}
              >
                Forgot password?
              </button>
            </div>
          </div>

          <CustomButton
            type="submit"
            className="w-full justify-center"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In to Admin'}
          </CustomButton>

          <div className="text-center mt-4">
            <a
              href="/"
              className="text-sm text-blue-600 hover:underline"
            >
              Return to website
            </a>
          </div>
        </form>

        {/* Hint for testing */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Use admin@example.com / admin123 to login
          </p>
        </div>
      </motion.div>
      
      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={closeErrorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-center text-red-500">Login Error</DialogTitle>
          <DialogDescription className="text-center">
            {errorMessage || "Invalid login credentials. Please try again."}
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                For testing, use: <br/>
                Email: admin@example.com <br/>
                Password: admin123
              </p>
            </div>
          </DialogDescription>
          <div className="flex justify-center mt-4">
            <CustomButton onClick={closeErrorDialog}>
              Try Again
            </CustomButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAuth;
