
import React from 'react';
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
  // Mock data for dashboard stats
  const dashboardStats = [
    { title: "Total Orders", value: "1,248", icon: ShoppingCart, change: "+12.5%", color: "bg-blue-500" },
    { title: "Total Sales", value: "$24,780", icon: DollarSign, change: "+8.2%", color: "bg-green-500" },
    { title: "Active Users", value: "856", icon: Users, change: "+18.3%", color: "bg-purple-500" },
    { title: "Low Stock Items", value: "12", icon: AlertTriangle, change: "-2.4%", color: "bg-amber-500" },
  ];

  // Mock data for recent orders
  const recentOrders = [
    { id: "#ORD-5289", customer: "John Smith", date: "2023-04-26", status: "Delivered", total: "$89.95" },
    { id: "#ORD-5288", customer: "Anna Johnson", date: "2023-04-26", status: "Preparing", total: "$124.00" },
    { id: "#ORD-5287", customer: "Robert Williams", date: "2023-04-26", status: "Pending", total: "$54.50" },
    { id: "#ORD-5286", customer: "Emily Davis", date: "2023-04-25", status: "Delivered", total: "$78.25" },
    { id: "#ORD-5285", customer: "Michael Brown", date: "2023-04-25", status: "Cancelled", total: "$112.99" },
  ];

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
                <p className={`text-sm mt-2 ${stat.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
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
              {recentOrders.map((order) => (
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
            <p>Sales chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
