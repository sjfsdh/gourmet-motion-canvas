
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, MapPin, Phone, Mail, Package, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AnimatedSection from '@/components/animations/AnimatedSection';

interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  zip_code: string;
}

interface UserOrder {
  id: number;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  items: Array<{
    quantity: number;
    price: number;
    menu_item: {
      name: string;
    };
  }>;
}

const Account = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '',
    full_name: '',
    phone: '',
    address: '',
    city: '',
    zip_code: ''
  });
  
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  // Fetch user profile
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch user orders
  const { data: userOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['userOrders', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            menu_items (
              name
            )
          )
        `)
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(order => ({
        ...order,
        items: order.order_items.map((item: any) => ({
          quantity: item.quantity,
          price: item.price,
          menu_item: item.menu_items
        }))
      }));
    },
    enabled: !!user?.email
  });

  // Update profile when data is loaded
  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile);
    } else if (user) {
      setProfile(prev => ({ ...prev, id: user.id }));
    }
  }, [userProfile, user]);

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    if (!profile.full_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Full name is required.",
        variant: "destructive"
      });
      return;
    }
    
    updateProfileMutation.mutate(profile);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom py-12">
        <AnimatedSection animation="fadeIn">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header */}
              <div className="bg-restaurant-green text-white p-6">
                <div className="flex items-center">
                  <User size={32} className="mr-4" />
                  <div>
                    <h1 className="text-2xl font-bold">My Account</h1>
                    <p className="text-restaurant-green-100">
                      Welcome back, {profile.full_name || user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                      activeTab === 'profile'
                        ? 'border-restaurant-green text-restaurant-green'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                      activeTab === 'orders'
                        ? 'border-restaurant-green text-restaurant-green'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Order History
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                    
                    {profileLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-restaurant-green"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User size={16} className="inline mr-2" />
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={profile.full_name}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone size={16} className="inline mr-2" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                            placeholder="Enter your phone number"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin size={16} className="inline mr-2" />
                            Address
                          </label>
                          <input
                            type="text"
                            value={profile.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                            placeholder="Enter your address"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={profile.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                            placeholder="Enter your city"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            value={profile.zip_code}
                            onChange={(e) => handleInputChange('zip_code', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                            placeholder="Enter your ZIP code"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail size={16} className="inline mr-2" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={user.email || ''}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            placeholder="Email address (cannot be changed)"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Email address cannot be changed. Contact support if needed.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-8 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveProfile}
                        disabled={updateProfileMutation.isPending}
                        className="bg-restaurant-green text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50"
                      >
                        <Save size={20} className="mr-2" />
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'orders' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold mb-6">Order History</h2>
                    
                    {ordersLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-restaurant-green"></div>
                      </div>
                    ) : userOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-500">Your order history will appear here when you place orders.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userOrders.map((order: UserOrder) => (
                          <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold">Order #{order.id}</h3>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">${Number(order.total).toFixed(2)}</p>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.quantity}x {item.menu_item.name}</span>
                                  <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Account;
