
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle, Mail, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CustomButton } from '@/components/ui/custom-button';
import { useAuth } from '@/contexts/AuthContext';

const AdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setIsAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'login' | 'signup' | 'verify'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check for email confirmation on component mount
  useEffect(() => {
    const checkEmailConfirmation = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (accessToken && type === 'signup') {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (session?.user && !error) {
            // Check if user is admin
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', session.user.id)
              .single();

            if (profile?.is_admin) {
              setIsAdmin(true);
              toast({
                title: "Admin Account Verified!",
                description: "Your admin account has been successfully verified.",
              });
              window.history.replaceState({}, document.title, window.location.pathname);
              navigate('/admin');
            } else {
              toast({
                title: "Account Verified",
                description: "Your account has been verified but you don't have admin privileges.",
                variant: "destructive"
              });
              await supabase.auth.signOut();
            }
          }
        } catch (error) {
          console.error('Error during email confirmation:', error);
        }
      }
    };

    checkEmailConfirmation();
  }, [navigate, toast, setIsAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password
      });
      
      if (error) {
        // Check if it's an email not confirmed error
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Verification Required",
            description: "Please verify your email before logging in. Check your inbox for the verification link.",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Login Failed",
          description: "Invalid login credentials. Please check your email and password.",
          variant: "destructive"
        });
        return;
      }
      
      if (data.user) {
        // Check if email is confirmed
        if (!data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          toast({
            title: "Email Verification Required",
            description: "Please verify your email before logging in. Check your inbox for the verification link.",
            variant: "destructive"
          });
          return;
        }

        // Check admin status
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();
        
        if (!profile?.is_admin) {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges to access this panel.",
            variant: "destructive"
          });
          return;
        }
        
        setIsAdmin(true);
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel!",
        });
        
        navigate('/admin');
      }
      
    } catch (error) {
      console.error('Login error:', error);
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
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/admin/login`;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: 'Admin User'
          }
        }
      });
      
      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data.user) {
        // Send admin verification email
        try {
          await supabase.functions.invoke('send-admin-verification', {
            body: {
              email: formData.email,
              inviteLink: redirectUrl,
              inviterName: 'DistinctGyrro Team'
            }
          });
        } catch (emailError) {
          console.error('Error sending admin verification email:', emailError);
        }

        toast({
          title: "Account Created",
          description: "Please check your email to verify your admin account.",
        });
        setStep('verify');
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Account Creation Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAdminLogin = async () => {
    setIsLoading(true);
    try {
      const demoEmail = 'admin@distinctgyrro.com';
      const demoPassword = 'admin123456';
      
      // First try to sign in
      let { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword
      });
      
      if (error && error.message.includes('Invalid login credentials')) {
        // Account doesn't exist, create it
        console.log('Demo admin account not found, creating...');
        
        const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
          email: demoEmail,
          password: demoPassword,
          email_confirm: true, // Automatically confirm email
          user_metadata: {
            full_name: 'Demo Admin'
          }
        });
        
        if (signUpError) {
          // Try regular signup if admin method fails
          const { data: regularSignUp, error: regularError } = await supabase.auth.signUp({
            email: demoEmail,
            password: demoPassword,
            options: {
              data: {
                full_name: 'Demo Admin'
              }
            }
          });
          
          if (regularError) {
            throw regularError;
          }
          
          // Now try to sign in again
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: demoEmail,
            password: demoPassword
          });
          
          if (loginError) {
            throw loginError;
          }
          
          data = loginData;
        } else {
          data = signUpData;
        }
      } else if (error && error.message.includes('Email not confirmed')) {
        // Try to update the user to confirm email
        await supabase.auth.admin.updateUserById(data?.user?.id || '', {
          email_confirm: true
        });
        
        // Try login again
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword
        });
        
        if (retryError) {
          throw retryError;
        }
        
        data = retryData;
      } else if (error) {
        throw error;
      }
      
      if (data?.user) {
        // Ensure admin status in profiles table
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            is_admin: true,
            full_name: 'Demo Admin'
          });
        
        setIsAdmin(true);
        toast({
          title: "Demo Login Successful",
          description: "Logged in as demo admin!",
        });
        
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast({
        title: "Demo Login Failed",
        description: error.message || "Failed to create or access demo admin account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error: any) {
      console.error('Resend verification error:', error);
      toast({
        title: "Failed to Resend",
        description: error.message || "Could not resend verification email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 text-center"
        >
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Mail className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h1>
          <p className="text-gray-600 mb-6">
            We've sent a verification email to <strong>{formData.email}</strong>. 
            Please check your inbox and click the verification link to activate your admin account.
          </p>
          
          <div className="space-y-3">
            <CustomButton
              onClick={resendVerificationEmail}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </CustomButton>
            
            <CustomButton
              onClick={() => setStep('login')}
              variant="outline"
              className="w-full"
            >
              Back to Login
            </CustomButton>
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
  }

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

        {/* Demo Login Button */}
        <div className="mb-6">
          <CustomButton
            onClick={handleDemoAdminLogin}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
          >
            {isLoading ? 'Logging in...' : '🚀 Demo Admin Login'}
          </CustomButton>
          <p className="text-xs text-gray-500 text-center mt-2">
            Quick login for testing (admin@distinctgyrro.com)
          </p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or use custom credentials</span>
          </div>
        </div>

        <div className="flex mb-6">
          <button
            onClick={() => setStep('login')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md ${
              step === 'login' 
                ? 'bg-restaurant-green text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setStep('signup')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md ${
              step === 'signup' 
                ? 'bg-restaurant-green text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Create Admin
          </button>
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
            {step === 'login' ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-restaurant-green text-white py-3 px-4 rounded-md font-semibold hover:bg-restaurant-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Signing In...' : 'Sign In as Admin'}
              </motion.button>
            ) : (
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
            )}
          </div>
        </form>

        {step === 'signup' && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="text-blue-600 mr-2 mt-0.5" size={16} />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Admin Account Setup:</p>
                <p>Enter your email and password to create an admin account. You'll receive a verification email to complete the setup.</p>
              </div>
            </div>
          </div>
        )}

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
