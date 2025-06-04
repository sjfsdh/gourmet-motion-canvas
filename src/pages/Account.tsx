
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Phone, Mail, Edit2, Save, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getAllDatabaseOrders } from '@/services/databaseOrderService';
import AnimatedSection from '@/components/animations/AnimatedSection';

interface UserProfile {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  zip_code: string;
}

const Account = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    zip_code: ''
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    zip_code: ''
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setProfile(data);
          setEditedProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch user orders
  const { data: allOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['databaseOrders'],
    queryFn: getAllDatabaseOrders,
  });

  // Filter orders for current user
  const userOrders = allOrders.filter(order => 
    user && order.customer_email === user.email
  );

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...editedProfile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({ newPassword: '', confirmPassword: '' });
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'preparing': return 'text-orange-600 bg-orange-100';
      case 'ready': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be logged in to view your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        <AnimatedSection animation="fadeIn">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center">
              <User className="mr-3" />
              My Account
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-restaurant-green hover:text-restaurant-green/80 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className="text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setEditedProfile(profile);
                            setIsEditing(false);
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="flex items-center text-gray-600">
                        <Mail size={16} className="mr-2" />
                        {user.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.full_name}
                          onChange={(e) => setEditedProfile({...editedProfile, full_name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="flex items-center text-gray-600">
                          <User size={16} className="mr-2" />
                          {profile.full_name || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="flex items-center text-gray-600">
                          <Phone size={16} className="mr-2" />
                          {profile.phone || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editedProfile.address}
                            onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                            placeholder="Street address"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editedProfile.city}
                              onChange={(e) => setEditedProfile({...editedProfile, city: e.target.value})}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                              placeholder="City"
                            />
                            <input
                              type="text"
                              value={editedProfile.zip_code}
                              onChange={(e) => setEditedProfile({...editedProfile, zip_code: e.target.value})}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                              placeholder="ZIP Code"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start text-gray-600">
                          <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                          <div>
                            {profile.address && (
                              <>
                                {profile.address}<br />
                                {profile.city} {profile.zip_code}
                              </>
                            )}
                            {!profile.address && 'Not provided'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Update Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green pr-10"
                          placeholder="New password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                        placeholder="Confirm new password"
                      />
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={isLoading || !passwordData.newPassword || !passwordData.confirmPassword}
                        className="w-full bg-restaurant-green text-white py-2 rounded-md hover:bg-restaurant-green/90 disabled:opacity-50 transition-colors"
                      >
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <Package className="mr-2" />
                    Order History
                  </h2>

                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-restaurant-green mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading orders...</p>
                    </div>
                  ) : userOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No orders found</p>
                      <p className="text-sm text-gray-500">Your order history will appear here once you place an order.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold">Order #{order.id}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()} at{' '}
                                {new Date(order.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <p className="text-lg font-semibold text-restaurant-green mt-1">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="border-t pt-3">
                            <h4 className="font-medium mb-2">Items:</h4>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.quantity}× {item.menu_item?.name || 'Unknown Item'}</span>
                                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Account;
