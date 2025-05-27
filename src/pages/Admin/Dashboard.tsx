import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Package,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState([
    { title: "Total Orders", value: "0", icon: ShoppingCart, change: "+0%", color: "bg-blue-500" },
    { title: "Total Sales", value: "$0.00", icon: DollarSign, change: "+0%", color: "bg-green-500" },
    { title: "Active Users", value: "0", icon: Users, change: "+0%", color: "bg-purple-500" },
    { title: "Low Stock Items", value: "0", icon: AlertTriangle, change: "+0%", color: "bg-amber-500" },
  ]);

  const [recentOrders, setRecentOrders] = useState([]);

  // Simulate real-time updates (in real app, this would come from your database)
  useEffect(() => {
    // Load data from localStorage or initialize empty
    const savedStats = localStorage.getItem('dashboardStats');
    const savedOrders = localStorage.getItem('recentOrders');
    
    if (savedStats) {
      setDashboardStats(JSON.parse(savedStats));
    }
    
    if (savedOrders) {
      setRecentOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Function to update stats (this would be called when new orders come in)
  const updateStats = () => {
    // In real app, fetch from database
    // For now, we'll keep it at 0 until real orders are placed
    setDashboardStats([
      { title: "Total Orders", value: "0", icon: ShoppingCart, change: "+0%", color: "bg-blue-500" },
      { title: "Total Sales", value: "$0.00", icon: DollarSign, change: "+0%", color: "bg-green-500" },
      { title: "Active Users", value: "0", icon: Users, change: "+0%", color: "bg-purple-500" },
      { title: "Low Stock Items", value: "0", icon: AlertTriangle, change: "+0%", color: "bg-amber-500" },
    ]);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-500">Welcome to your restaurant dashboard</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
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
                <p className={`text-sm mt-2 ${stat.change.includes('+') && stat.change !== '+0%' ? 'text-green-500' : 'text-gray-500'}`}>
                  {stat.change} since last month
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
          <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">View All</button>
        </div>
        
        {recentOrders.length === 0 ? (
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
                {recentOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-500 hover:text-blue-700 mr-3">View</button>
                      <button className="text-gray-500 hover:text-gray-700">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sales chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Sales Overview</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-md">Monthly</button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">Weekly</button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">Daily</button>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="flex flex-col items-center">
            <TrendingUp size={48} className="text-gray-300 mb-3" />
            <p>Sales data will appear here when orders are placed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
