
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, Mail, RefreshCw } from 'lucide-react';
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
          // Get the current session after email confirmation
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (session?.user && !error) {
            // Assign admin role to the confirmed user
            const { error: roleError } = await supabase
              .from('user_roles')
              .upsert({
                user_id: session.user.id,
                role: 'admin'
              });

            if (roleError) {
              console.error('Error assigning admin role:', roleError);
              toast({
                title: "Role Assignment Failed",
                description: "Account verified but admin role assignment failed. Please contact support.",
                variant: "destructive"
              });
              return;
            }

            setIsAdmin(true);
            toast({
              title: "Admin Account Verified!",
              description: "Your admin account has been successfully verified. Welcome to the admin panel!",
            });

            // Clear the hash and redirect to admin dashboard
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate('/admin');
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

  const sendVerificationEmail = async (email: string, isResend = false) => {
    try {
      const redirectUrl = `${window.location.origin}/admin/login`;
      
      // Call our edge function to send verification email
      const response = await fetch('/api/send-admin-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          confirmUrl: redirectUrl,
          siteName: 'DistinctGyrro'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      toast({
        title: isResend ? "Verification Email Resent" : "Verification Email Sent",
        description: `Please check your email (${email}) and click the verification link.`,
      });

    } catch (error) {
      console.error('Error sending verification email:', error);
      toast({
        title: "Email Send Failed",
        description: "Could not send verification email. The account was created but you may need manual verification.",
        variant: "destructive"
      });
    }
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
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Confirmed",
            description: "Please check your email and confirm your account first.",
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
        // Check admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();
        
        if (roleError || !roleData || roleData.role !== 'admin') {
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
        if (error.message.includes('User already registered')) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Try logging in instead.",
            variant: "destructive"
          });
          setStep('login');
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
        // Send custom verification email
        await sendVerificationEmail(formData.email);
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
              onClick={() => sendVerificationEmail(formData.email, true)}
              disabled={isLoading}
              className="w-full flex items-center justify-center"
            >
              {isLoading ? (
                <RefreshCw className="animate-spin mr-2" size={16} />
              ) : (
                <Mail className="mr-2" size={16} />
              )}
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
