
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('AdminAuth: Attempting login with:', formData.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password
      });
      
      if (error) {
        console.error('AdminAuth: Login error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Confirmed",
            description: "Please check your email and confirm your account.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }
      
      if (data.user) {
        console.log('AdminAuth: Login successful:', data.user.email);
        
        // Check if user has admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();
        
        if (roleError || !roleData || roleData.role !== 'admin') {
          console.error('AdminAuth: User is not an admin:', roleError);
          
          // Sign out the user since they don't have admin access
          await supabase.auth.signOut();
          
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges to access this panel.",
            variant: "destructive"
          });
          return;
        }
        
        console.log('AdminAuth: Admin access confirmed');
        
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel!",
        });
        
        navigate('/admin/dashboard');
      }
      
    } catch (error) {
      console.error('AdminAuth: Unexpected error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdminAccount = async () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password to create an admin account.",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('AdminAuth: Creating admin account for:', formData.email);
      
      // First, try to sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/auth`
        }
      });
      
      if (error) {
        console.error('AdminAuth: Signup error:', error);
        
        if (error.message.includes('User already registered')) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Try logging in instead.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }
      
      if (data.user) {
        console.log('AdminAuth: Signup successful:', data.user.email);
        
        // If user needs email confirmation
        if (!data.session) {
          toast({
            title: "Check Your Email",
            description: "Please check your email and confirm your account before logging in.",
          });
          return;
        }
        
        // User is signed in, now assign admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: data.user.id,
            role: 'admin'
          });
        
        if (roleError) {
          console.error('AdminAuth: Role assignment error:', roleError);
          toast({
            title: "Role Assignment Failed",
            description: "Account created but admin role assignment failed. Please contact support.",
            variant: "destructive"
          });
          return;
        }
        
        console.log('AdminAuth: Admin role assigned successfully');
        
        toast({
          title: "Admin Account Created",
          description: "Your admin account has been created successfully! You can now log in.",
        });
        
        // Clear form
        setFormData({ email: '', password: '' });
      }
      
    } catch (error) {
      console.error('AdminAuth: Unexpected error:', error);
      toast({
        title: "Account Creation Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <div className="bg-restaurant-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Secure access to restaurant management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter admin email"
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-restaurant-green text-white py-3 px-4 rounded-md font-semibold hover:bg-restaurant-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Signing In...' : 'Sign In as Admin'}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleCreateAdminAccount}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Creating Account...' : 'Create Admin Account'}
            </motion.button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mr-2 mt-0.5" size={16} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">First Time Setup:</p>
              <p>Enter your desired admin email and password, then click "Create Admin Account" to set up your admin credentials.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Website
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuth;
