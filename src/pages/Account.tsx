
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, Mail, Package, Eye, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserOrders, Order } from '@/services/orderService';
import ViewDetailsModal from '@/components/modals/ViewDetailsModal';
import { CustomButton } from '@/components/ui/custom-button';
import AnimatedSection from '@/components/animations/AnimatedSection';

const Account = () => {
  const { user } = useAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user?.id) {
      const orders = getUserOrders(user.id);
      setUserOrders(orders);
    }
  }, [user]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <AnimatedSection animation="fadeIn">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-restaurant-green to-blue-600 px-6 py-8 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.name || user.email}</h1>
                  <p className="opacity-90">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 border-b-2 transition-colors ${
                    activeTab === 'profile'
                      ? 'border-restaurant-green text-restaurant-green'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 border-b-2 transition-colors ${
                    activeTab === 'orders'
                      ? 'border-restaurant-green text-restaurant-green'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Orders ({userOrders.length})
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">Personal Information</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <User size={20} className="text-gray-500" />
                          <div>
                            <p className="font-medium">Full Name</p>
                            <p className="text-gray-600">{user.name || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <Mail size={20} className="text-gray-500" />
                          <div>
                            <p className="font-medium">Email Address</p>
                            <p className="text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <Phone size={20} className="text-gray-500" />
                          <div>
                            <p className="font-medium">Phone Number</p>
                            <p className="text-gray-600">Not provided</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <MapPin size={20} className="text-gray-500" />
                          <div>
                            <p className="font-medium">Address</p>
                            <p className="text-gray-600">Not provided</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">Account Statistics</h2>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                          <Package size={24} className="mb-2" />
                          <p className="text-2xl font-bold">{userOrders.length}</p>
                          <p className="text-blue-100">Total Orders</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
                          <CreditCard size={24} className="mb-2" />
                          <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                          <p className="text-green-100">Total Spent</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-semibold mb-3">Membership Since</h3>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar size={16} />
                          <span>January 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Order History</h2>
                    {userOrders.length > 0 && (
                      <p className="text-gray-600">
                        Total: {formatCurrency(totalSpent)} from {userOrders.length} orders
                      </p>
                    )}
                  </div>

                  {userOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package size={64} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-6">
                        You haven't placed any orders yet. Start by browsing our delicious menu!
                      </p>
                      <CustomButton
                        onClick={() => window.location.href = '/menu'}
                      >
                        Browse Menu
                      </CustomButton>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">Order #{order.id.slice(-8)}</h3>
                              <p className="text-gray-600">
                                {new Date(order.created_at).toLocaleDateString()} at{' '}
                                {new Date(order.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-restaurant-green">
                                {formatCurrency(order.total)}
                              </p>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full">
                                <span className="text-sm">{item.name}</span>
                                <span className="text-xs text-gray-500">×{item.quantity}</span>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                                +{order.items.length - 3} more
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end">
                            <CustomButton
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                              icon={<Eye size={16} />}
                            >
                              View Details
                            </CustomButton>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* View Details Modal */}
      <ViewDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        type="order"
      />
    </div>
  );
};

export default Account;
