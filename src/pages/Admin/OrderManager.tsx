
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Search,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllDatabaseOrders, updateOrderStatus, OrderWithItems } from '@/services/databaseOrderService';

// Order status options
const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'preparing', label: 'Preparing', color: 'bg-blue-100 text-blue-800' },
  { value: 'ready', label: 'Ready', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
];

const OrderManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch orders from database
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['databaseOrders'],
    queryFn: getAllDatabaseOrders
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: any }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['databaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['orderStats'] });
      toast({
        title: "Order Status Updated",
        description: "Order status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  });

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusBadge = (status: string) => {
    const statusObj = ORDER_STATUSES.find(s => s.value === status);
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered':
        return <CheckCircle size={14} className="mr-1 text-green-600" />;
      case 'cancelled':
        return <XCircle size={14} className="mr-1 text-red-600" />;
      default:
        return <Clock size={14} className="mr-1 text-yellow-600" />;
    }
  };

  // Filter orders based on search and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm.toLowerCase()) || 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-restaurant-green"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Orders</h3>
          <p className="text-red-500">Failed to load orders. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Order Management</h1>
          <p className="text-gray-500">Manage and process customer orders</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
          >
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <motion.li
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <div className="px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900 mr-3">#{order.id}</h3>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusBadge(order.status)}`}
                          disabled={updateStatusMutation.isPending}
                        >
                          {ORDER_STATUSES.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                        <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {order.payment_status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
                        <p>{order.customer_name}</p>
                        <span className="hidden sm:inline mx-2">•</span>
                        <p>{new Date(order.created_at).toLocaleDateString()}</p>
                        <span className="hidden sm:inline mx-2">•</span>
                        <p>${Number(order.total).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-3 sm:mt-0">
                      <button
                        onClick={() => toggleOrderExpand(order.id)}
                        className="p-1 ml-2 text-gray-500 hover:text-gray-700"
                      >
                        {expandedOrder === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Order details */}
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 bg-gray-50 p-4 rounded-md"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                          <p className="text-sm text-gray-700">Name: {order.customer_name}</p>
                          <p className="text-sm text-gray-700">Email: {order.customer_email}</p>
                          <p className="text-sm text-gray-700">Phone: {order.customer_phone}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
                          <p className="text-sm text-gray-700">Address: {order.address}</p>
                          <p className="text-sm text-gray-700">Payment Method: {order.payment_method}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {order.items.map(item => (
                              <tr key={item.id}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.menu_item.name}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${Number(item.price).toFixed(2)}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${Number(item.subtotal).toFixed(2)}</td>
                              </tr>
                            ))}
                            <tr className="bg-gray-100">
                              <td colSpan={3} className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">Total:</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">${Number(order.total).toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderManager;
