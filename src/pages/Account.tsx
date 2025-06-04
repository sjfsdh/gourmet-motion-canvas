
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Edit, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/animations/AnimatedSection';

interface Order {
  id: number;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    menu_item: {
      name: string;
      image: string;
    };
  }>;
}

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  zip_code: string | null;
}

const Account = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<Profile>({
    id: user?.id || '',
    full_name: '',
    phone: '',
    address: '',
    city: '',
    zip_code: ''
  });

  // Fetch user profile
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch user orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['userOrders', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (
              name,
              image
            )
          )
        `)
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }
      
      return data.map(order => ({
        ...order,
        items: order.order_items.map((item: any) => ({
          ...item,
          menu_item: item.menu_items
        }))
      }));
    },
    enabled: !!user?.email
  });

  // Initialize profile data when profile is loaded
  React.useEffect(() => {
    if (profile) {
      setProfileData({
        id: profile.id,
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        zip_code: profile.zip_code || ''
      });
    }
  }, [profile]);

  const handleProfileUpdate = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          zip_code: profileData.zip_code,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsEditingProfile(false);
      refetchProfile();
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your account</h1>
          <a href="/auth" className="btn-primary">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'preparing':
        return 'text-blue-600 bg-blue-100';
      case 'ready':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-12">
        <AnimatedSection animation="fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">My Account</h1>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <AnimatedSection animation="slideInLeft" className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <User className="mr-2" />
                  Profile
                </h2>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center space-x-1 text-restaurant-green hover:text-restaurant-green/80"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleProfileUpdate}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                    >
                      <Save size={16} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    disabled={!isEditingProfile}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      isEditingProfile ? 'bg-white' : 'bg-gray-50'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditingProfile}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      isEditingProfile ? 'bg-white' : 'bg-gray-50'
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditingProfile}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      isEditingProfile ? 'bg-white' : 'bg-gray-50'
                    }`}
                    placeholder="Enter your address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!isEditingProfile}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                        isEditingProfile ? 'bg-white' : 'bg-gray-50'
                      }`}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={profileData.zip_code}
                      onChange={(e) => handleInputChange('zip_code', e.target.value)}
                      disabled={!isEditingProfile}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                        isEditingProfile ? 'bg-white' : 'bg-gray-50'
                      }`}
                      placeholder="ZIP"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={signOut}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Orders Section */}
          <AnimatedSection animation="slideInRight" className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <ShoppingBag className="mr-2" />
                Order History ({orders.length})
              </h2>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-restaurant-green"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-4">Start by ordering some delicious food!</p>
                  <a
                    href="/menu"
                    className="inline-block bg-restaurant-green text-white px-6 py-2 rounded-md hover:bg-restaurant-green/90 transition-colors"
                  >
                    Browse Menu
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <p className="text-lg font-semibold mt-1">
                            ${Number(order.total).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span>{item.quantity}x {item.menu_item.name}</span>
                            <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default Account;
