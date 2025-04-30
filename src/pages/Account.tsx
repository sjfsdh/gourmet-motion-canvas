
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, ShoppingBag, CreditCard, Heart, Settings, LogOut, Home, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/custom-button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Mock order data
const orders = [
  {
    id: 12345,
    date: '2023-04-25',
    total: 45.98,
    status: 'Delivered',
    items: [
      { name: 'Burrata Salad', quantity: 1, price: 14.99 },
      { name: 'Truffle Arancini', quantity: 1, price: 12.99 },
      { name: 'Chocolate Fondant', quantity: 1, price: 12.99 },
    ]
  },
  {
    id: 12344,
    date: '2023-04-20',
    total: 58.97,
    status: 'Delivered',
    items: [
      { name: 'Filet Mignon', quantity: 1, price: 42.99 },
      { name: 'Truffle Fries', quantity: 1, price: 9.99 },
    ]
  }
];

interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
}

const Account = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 1, name: 'Home', street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', default: true },
    { id: 2, name: 'Work', street: '456 Park Ave', city: 'New York', state: 'NY', zip: '10022', default: false }
  ]);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'default'>>({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Get user metadata
      const metadata = user.user_metadata || {};
      setProfile({
        name: metadata.full_name || user.email?.split('@')[0] || '',
        email: user.email || '',
        phone: metadata.phone || ''
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out from your account",
    });
    
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.name,
          phone: profile.phone
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddAddress = () => {
    if (!showAddAddressForm) {
      setShowAddAddressForm(true);
      return;
    }
    
    // Validate form
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip) {
      toast({
        title: "Validation Error",
        description: "Please fill in all address fields",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...addresses.map(addr => addr.id), 0) + 1;
    const addressToAdd = {
      ...newAddress,
      id: newId,
      default: addresses.length === 0
    };
    
    setAddresses([...addresses, addressToAdd]);
    setNewAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zip: ''
    });
    setShowAddAddressForm(false);
    
    toast({
      title: "Address Added",
      description: "Your new address has been added successfully",
    });
  };

  const handleRemoveAddress = (id: number) => {
    const addressToRemove = addresses.find(addr => addr.id === id);
    const wasDefault = addressToRemove?.default || false;
    
    const filteredAddresses = addresses.filter(addr => addr.id !== id);
    
    // If the removed address was default and we have other addresses,
    // make the first one default
    if (wasDefault && filteredAddresses.length > 0) {
      filteredAddresses[0].default = true;
    }
    
    setAddresses(filteredAddresses);
    
    toast({
      title: "Address Removed",
      description: "The address has been removed from your account",
    });
  };

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      default: addr.id === id
    })));
    
    toast({
      title: "Default Address Updated",
      description: "Your default address has been updated.",
    });
  };

  const handleUpdatePassword = () => {
    toast({
      title: "Password Update",
      description: "This functionality will be implemented soon.",
    });
  };
  
  const handleAddPaymentMethod = () => {
    toast({
      title: "Coming Soon",
      description: "Payment method management will be available soon.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p>Loading account information...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: User, label: 'Profile', value: 'profile' },
    { icon: ShoppingBag, label: 'Orders', value: 'orders' },
    { icon: Home, label: 'Addresses', value: 'addresses' },
    { icon: Heart, label: 'Favorites', value: 'favorites' },
    { icon: CreditCard, label: 'Payment Methods', value: 'payments' },
    { icon: Lock, label: 'Security', value: 'security' },
    { icon: Settings, label: 'Settings', value: 'settings' },
    { icon: LogOut, label: 'Logout', onClick: handleLogout, className: 'text-red-500' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container-custom">
        <AnimatedSection animation="fadeIn">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <User size={40} className="text-gray-500" />
                  </div>
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-gray-500">{profile.email}</p>
                </div>
                
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick || (() => setActiveTab(item.value))}
                      className={`w-full flex items-center p-3 rounded-md transition-colors ${
                        activeTab === item.value 
                          ? 'bg-gray-100 text-restaurant-green'
                          : 'hover:bg-gray-100'
                      } ${item.className || ''}`}
                    >
                      <item.icon size={18} className="mr-3" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="profile" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={profile.phone || ''}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            placeholder="Add your phone number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>
                        
                        <div className="pt-4">
                          <CustomButton 
                            onClick={handleSaveProfile} 
                            disabled={isUpdating}
                          >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                          </CustomButton>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orders" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Order History</h2>
                      
                      {orders.length > 0 ? (
                        <div className="space-y-6">
                          {orders.map((order) => (
                            <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <span className="text-sm text-gray-500">Order #:</span>
                                  <span className="font-medium ml-1">{order.id}</span>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {order.status}
                                </div>
                              </div>
                              
                              <div className="text-sm mb-3">
                                <span className="text-gray-500">Date: </span>
                                <span>{new Date(order.date).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="border-t border-gray-200 pt-3 mt-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center mb-1 text-sm">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>${item.price.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="font-semibold">${order.total.toFixed(2)}</span>
                              </div>
                              
                              <div className="mt-4">
                                <CustomButton variant="secondary" className="text-sm py-1">
                                  View Details
                                </CustomButton>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ShoppingBag className="mx-auto text-gray-400 mb-3" size={48} />
                          <p className="text-lg font-medium text-gray-600 mb-2">No orders yet</p>
                          <p className="text-gray-500 mb-4">When you place an order, it will appear here.</p>
                          <CustomButton onClick={() => navigate('/menu')}>
                            Browse Menu
                          </CustomButton>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="addresses" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Saved Addresses</h2>
                        <CustomButton onClick={handleAddAddress} size="sm">
                          {showAddAddressForm ? 'Save New Address' : 'Add New Address'}
                        </CustomButton>
                      </div>
                      
                      {showAddAddressForm && (
                        <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
                          <h3 className="font-medium mb-3">New Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Address Name</label>
                              <input
                                type="text"
                                placeholder="Home, Work, etc."
                                value={newAddress.name}
                                onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                              <input
                                type="text"
                                placeholder="123 Main St"
                                value={newAddress.street}
                                onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                              <input
                                type="text"
                                placeholder="City"
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                              <input
                                type="text"
                                placeholder="State"
                                value={newAddress.state}
                                onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                              <input
                                type="text"
                                placeholder="ZIP"
                                value={newAddress.zip}
                                onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <CustomButton 
                              variant="outline" 
                              onClick={() => setShowAddAddressForm(false)}
                            >
                              Cancel
                            </CustomButton>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-medium">{address.name}</h3>
                                  {address.default && (
                                    <span className="ml-2 bg-restaurant-green/10 text-restaurant-green text-xs px-2 py-0.5 rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 mt-1">
                                  {address.street}<br />
                                  {address.city}, {address.state} {address.zip}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <button 
                                  className="text-gray-500 hover:text-red-600"
                                  onClick={() => handleRemoveAddress(address.id)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            {!address.default && (
                              <button 
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="mt-3 text-sm text-restaurant-green hover:underline"
                              >
                                Set as default
                              </button>
                            )}
                          </div>
                        ))}
                        
                        {addresses.length === 0 && !showAddAddressForm && (
                          <div className="text-center py-8">
                            <Home className="mx-auto text-gray-400 mb-3" size={48} />
                            <p className="text-lg font-medium text-gray-600 mb-2">No addresses yet</p>
                            <p className="text-gray-500 mb-4">Add an address for faster checkout.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="favorites" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Favorite Items</h2>
                      <div className="text-center py-8">
                        <Heart className="mx-auto text-gray-400 mb-3" size={48} />
                        <p className="text-lg font-medium text-gray-600 mb-2">No favorites yet</p>
                        <p className="text-gray-500 mb-4">Save your favorite items for quick access later.</p>
                        <CustomButton onClick={() => navigate('/menu')}>
                          Browse Menu
                        </CustomButton>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payments" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                      <div className="text-center py-8">
                        <CreditCard className="mx-auto text-gray-400 mb-3" size={48} />
                        <p className="text-lg font-medium text-gray-600 mb-2">No payment methods yet</p>
                        <p className="text-gray-500 mb-4">Add a payment method for faster checkout.</p>
                        <CustomButton onClick={handleAddPaymentMethod}>
                          Add Payment Method
                        </CustomButton>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>
                        
                        <div className="pt-4">
                          <CustomButton onClick={handleUpdatePassword}>Update Password</CustomButton>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-6 mt-6">
                          <h3 className="font-medium mb-2">Login History</h3>
                          <div className="text-sm text-gray-500">
                            <p>Last login: {new Date().toLocaleString()}</p>
                            <p>Device: Browser on {navigator.platform}</p>
                            <p>Location: Unknown</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">Notifications</h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Email notifications</p>
                                <p className="text-sm text-gray-500">Receive order updates via email</p>
                              </div>
                              <div>
                                <input 
                                  type="checkbox" 
                                  defaultChecked 
                                  className="rounded text-restaurant-green focus:ring-restaurant-green"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Special offers</p>
                                <p className="text-sm text-gray-500">Receive special offers and promotions</p>
                              </div>
                              <div>
                                <input 
                                  type="checkbox" 
                                  defaultChecked 
                                  className="rounded text-restaurant-green focus:ring-restaurant-green"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-6">
                          <h3 className="font-medium mb-2">Language and Region</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                              <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green">
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-6">
                          <h3 className="font-medium mb-4 text-red-600">Danger Zone</h3>
                          <CustomButton variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                            Delete Account
                          </CustomButton>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Account;
