
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, ShoppingBag, CreditCard, Heart, Settings, LogOut, Home, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/custom-button';

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

const Account = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([
    { id: 1, name: 'Home', street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', default: true },
    { id: 2, name: 'Work', street: '456 Park Ave', city: 'New York', state: 'NY', zip: '10022', default: false }
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/auth');
      return;
    }
    
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out from your account",
    });
    
    navigate('/');
  };

  const handleAddAddress = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Address management will be available soon.",
    });
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      default: addr.id === id
    })));
    
    toast({
      title: "Default Address Updated",
      description: "Your default address has been updated.",
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
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
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
                            defaultValue={user.name}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            defaultValue={user.email}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input
                            type="text"
                            placeholder="Add your phone number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>
                        
                        <div className="pt-4">
                          <CustomButton>Save Changes</CustomButton>
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
                          Add New Address
                        </CustomButton>
                      </div>
                      
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
                                <button className="text-gray-500 hover:text-blue-600">
                                  <Settings size={16} />
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
                        <CustomButton>
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
                          <CustomButton>Update Password</CustomButton>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-6 mt-6">
                          <h3 className="font-medium mb-2">Login History</h3>
                          <div className="text-sm text-gray-500">
                            <p>Last login: {new Date().toLocaleString()}</p>
                            <p>Device: Chrome on Windows</p>
                            <p>Location: New York, USA</p>
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
                          <CustomButton variant="destructive">
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
