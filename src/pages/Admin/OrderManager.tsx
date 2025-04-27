
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

// Mock order status options
const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'preparing', label: 'Preparing', color: 'bg-blue-100 text-blue-800' },
  { value: 'ready', label: 'Ready', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
];

// Mock payment status options
const PAYMENT_STATUSES = [
  { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' }
];

// Mock orders data
const MOCK_ORDERS = [
  {
    id: 'ORD-5291',
    customer: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567'
    },
    date: '2023-04-27 14:35',
    items: [
      { id: 1, name: 'Classic Gyro', quantity: 2, price: 12.99 },
      { id: 2, name: 'Greek Salad', quantity: 1, price: 8.99 },
      { id: 3, name: 'Baklava', quantity: 1, price: 6.99 }
    ],
    total: 41.96,
    status: 'pending',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    address: '123 Main St, Anytown, CA 12345'
  },
  {
    id: 'ORD-5290',
    customer: {
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      phone: '(555) 987-6543'
    },
    date: '2023-04-27 13:22',
    items: [
      { id: 4, name: 'Falafel Plate', quantity: 1, price: 14.99 },
      { id: 5, name: 'Hummus & Pita', quantity: 1, price: 7.99 },
      { id: 6, name: 'Turkish Coffee', quantity: 2, price: 4.99 }
    ],
    total: 32.96,
    status: 'preparing',
    paymentStatus: 'paid',
    paymentMethod: 'PayPal',
    address: '456 Oak Ave, Somewhere, CA 54321'
  },
  {
    id: 'ORD-5289',
    customer: {
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '(555) 555-5555'
    },
    date: '2023-04-27 12:05',
    items: [
      { id: 7, name: 'Lamb Souvlaki', quantity: 2, price: 16.99 },
      { id: 8, name: 'Spanakopita', quantity: 1, price: 9.99 },
      { id: 9, name: 'Bottle of Wine', quantity: 1, price: 24.99 }
    ],
    total: 68.96,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    address: '789 Pine St, Elsewhere, CA 98765'
  },
  {
    id: 'ORD-5288',
    customer: {
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      phone: '(555) 222-3333'
    },
    date: '2023-04-27 11:17',
    items: [
      { id: 10, name: 'Vegetarian Platter', quantity: 1, price: 19.99 },
      { id: 11, name: 'Tzatziki Side', quantity: 1, price: 4.99 }
    ],
    total: 24.98,
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'Debit Card',
    address: '321 Elm Rd, Nowhere, CA 45678'
  },
  {
    id: 'ORD-5287',
    customer: {
      name: 'David Martinez',
      email: 'david.martinez@example.com',
      phone: '(555) 444-9999'
    },
    date: '2023-04-27 10:32',
    items: [
      { id: 12, name: 'Family Meal Deal', quantity: 1, price: 49.99 },
      { id: 13, name: 'Baklava Assortment', quantity: 1, price: 14.99 }
    ],
    total: 64.98,
    status: 'ready',
    paymentStatus: 'pending',
    paymentMethod: 'Cash on Delivery',
    address: '567 Cherry Ln, Anyplace, CA 13579'
  }
];

const OrderManager = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [orderStatusEdit, setOrderStatusEdit] = useState('');

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    setEditingOrder(null);
    
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
    
    toast({
      title: "Order Deleted",
      description: `Order ${orderId} has been removed`,
      variant: "destructive"
    });
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const startEditStatus = (order: any) => {
    setEditingOrder(order.id);
    setOrderStatusEdit(order.status);
  };

  const cancelEdit = () => {
    setEditingOrder(null);
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

  const getPaymentStatusBadge = (status: string) => {
    const statusObj = PAYMENT_STATUSES.find(s => s.value === status);
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800';
  };

  // Filter orders based on search and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
                        <h3 className="text-lg font-medium text-gray-900 mr-3">{order.id}</h3>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                        </span>
                        <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadge(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
                        <p>{order.customer.name}</p>
                        <span className="hidden sm:inline mx-2">•</span>
                        <p>{order.date}</p>
                        <span className="hidden sm:inline mx-2">•</span>
                        <p>${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-3 sm:mt-0">
                      {editingOrder === order.id ? (
                        <div className="flex items-center">
                          <select
                            value={orderStatusEdit}
                            onChange={(e) => setOrderStatusEdit(e.target.value)}
                            className="mr-2 p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-restaurant-green"
                          >
                            {ORDER_STATUSES.map(status => (
                              <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                          </select>
                          <button 
                            onClick={() => handleStatusChange(order.id, orderStatusEdit)}
                            className="p-1 text-green-600 hover:text-green-900"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={cancelEdit}
                            className="p-1 text-red-600 hover:text-red-900 ml-1"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditStatus(order)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900 p-1 ml-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
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
                          <p className="text-sm text-gray-700">Name: {order.customer.name}</p>
                          <p className="text-sm text-gray-700">Email: {order.customer.email}</p>
                          <p className="text-sm text-gray-700">Phone: {order.customer.phone}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
                          <p className="text-sm text-gray-700">Address: {order.address}</p>
                          <p className="text-sm text-gray-700">Payment Method: {order.paymentMethod}</p>
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
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${(item.quantity * item.price).toFixed(2)}</td>
                              </tr>
                            ))}
                            <tr className="bg-gray-100">
                              <td colSpan={3} className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">Total:</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
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
