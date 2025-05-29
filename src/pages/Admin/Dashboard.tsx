import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Package,
  TrendingUp,
  AlertTriangle,
  Eye,
  Edit
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllMenuItems, getMenuItemCount } from '@/services/menuService';
import { getAllDatabaseOrders, getDatabaseOrderStats, updateOrderStatus, OrderWithItems } from '@/services/databaseOrderService';
import ViewDetailsModal from '@/components/modals/ViewDetailsModal';
import { CustomButton } from '@/components/ui/custom-button';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch menu items count
  const { data: menuItemsCount = 0 } = useQuery({
    queryKey: ['menuItemsCount'],
    queryFn: getMenuItemCount
  });

  // Fetch orders from database
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['databaseOrders'],
    queryFn: getAllDatabaseOrders
  });

  // Fetch order statistics
  const { data: dashboardStats } = useQuery({
    queryKey: ['orderStats'],
    queryFn: getDatabaseOrderStats
  });

  const stats = dashboardStats || {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    deliveredOrders: 0,
    todayOrders: 0,
    todayRevenue: 0
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  const handleViewOrder = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (orderId: number, newStatus: any) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      refetchOrders();
      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const statsCards = [
    { 
      title: "Menu Items", 
      value: menuItemsCount.toString(), 
      icon: Package, 
      change: `Total items in menu`, 
      color: "bg-blue-500" 
    },
    { 
      title: "Total Orders", 
      value: stats.totalOrders.toString(), 
      icon: ShoppingCart, 
      change: stats.todayOrders > 0 ? `+${stats.todayOrders} today` : "No orders today", 
      color: "bg-green-500" 
    },
    { 
      title: "Total Revenue", 
      value: formatCurrency(stats.totalRevenue), 
      icon: DollarSign, 
      change: stats.todayRevenue > 0 ? `+${formatCurrency(stats.todayRevenue)} today` : "No revenue today", 
      color: "bg-purple-500" 
    },
    { 
      title: "Pending Orders", 
      value: stats.pendingOrders.toString(), 
      icon: AlertTriangle, 
      change: stats.preparingOrders > 0 ? `${stats.preparingOrders} preparing` : "No orders preparing", 
      color: "bg-orange-500" 
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-500">Welcome to your restaurant dashboard</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 mb-1 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm mt-2 text-gray-600">
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                <stat.icon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
        </div>
        
        {ordersLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-restaurant-green mx-auto"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500">Orders will appear here when customers place them.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(Number(order.total))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-500 hover:text-blue-700 mr-3 flex items-center"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sales chart placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Sales Overview</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-md">Daily</button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">Weekly</button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">Monthly</button>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="flex flex-col items-center">
            <TrendingUp size={48} className="text-gray-300 mb-3" />
            {stats.totalRevenue > 0 ? (
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700">
                  Total Revenue: {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-sm text-gray-500">
                  From {stats.totalOrders} orders
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Menu Items: {menuItemsCount}
                </p>
              </div>
            ) : (
              <p>Sales data will appear here when orders are placed</p>
            )}
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <ViewDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder as any}
        type="order"
      />
    </div>
  );
};

export default Dashboard;
