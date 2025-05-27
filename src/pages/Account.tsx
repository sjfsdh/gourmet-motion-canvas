
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Heart, 
  CreditCard, 
  Shield, 
  Settings 
} from 'lucide-react';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { CustomButton } from '@/components/ui/custom-button';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userOrders, setUserOrders] = useState([]); // Empty for new users

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-md" placeholder="Enter your first name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-md" placeholder="Enter your last name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full p-3 border border-gray-300 rounded-md" placeholder="Enter your email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" className="w-full p-3 border border-gray-300 rounded-md" placeholder="Enter your phone number" />
              </div>
            </div>
            <CustomButton>Save Changes</CustomButton>
          </div>
        );
      
      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Order History</h2>
            {userOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">When you place your first order, it will appear here.</p>
                <CustomButton onClick={() => window.location.href = '/menu'}>
                  Browse Menu
                </CustomButton>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order: any) => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-gray-500">{order.date}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.name} × {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between items-center">
                      <strong>Total: ${order.total}</strong>
                      <CustomButton variant="outline" size="sm">
                        View Details
                      </CustomButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'addresses':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Delivery Addresses</h2>
            <div className="text-center py-12">
              <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-500 mb-6">Add your delivery addresses for faster checkout.</p>
              <CustomButton>Add New Address</CustomButton>
            </div>
          </div>
        );
      
      case 'favorites':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Favorite Items</h2>
            <div className="text-center py-12">
              <Heart size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-500 mb-6">Save your favorite dishes for quick reordering.</p>
              <CustomButton onClick={() => window.location.href = '/menu'}>
                Browse Menu
              </CustomButton>
            </div>
          </div>
        );
      
      case 'payment':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Payment Methods</h2>
            <div className="text-center py-12">
              <CreditCard size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No payment methods saved</h3>
              <p className="text-gray-500 mb-6">Add your payment methods for faster checkout.</p>
              <CustomButton>Add Payment Method</CustomButton>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Security Settings</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-2">Change Password</h3>
                <p className="text-gray-600 text-sm mb-4">Update your password to keep your account secure.</p>
                <CustomButton variant="outline">Change Password</CustomButton>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-gray-600 text-sm mb-4">Add an extra layer of security to your account.</p>
                <CustomButton variant="outline">Enable 2FA</CustomButton>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Account Settings</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-2">Email Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Order updates and confirmations
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Special offers and promotions
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Newsletter and updates
                  </label>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-2">Privacy Settings</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Allow order history analytics
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Share data for personalized recommendations
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <AnimatedSection animation="fadeIn">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <div className="w-full md:w-64 bg-gray-50 p-6">
                <div className="mb-6">
                  <h1 className="text-xl font-bold">My Account</h1>
                  <p className="text-gray-600 text-sm">user@example.com</p>
                </div>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-md text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-restaurant-green text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <tab.icon size={18} className="mr-3" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Account;
