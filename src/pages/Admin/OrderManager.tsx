
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, RefreshCw, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock orders for the order management system
const initialOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    date: '2025-04-27T09:30:00Z',
    total: 42.75,
    status: 'pending',
    items: [
      { id: 1, name: 'Burrata Salad', quantity: 1, price: 14.99 },
      { id: 4, name: 'Filet Mignon', quantity: 1, price: 42.99 }
    ]
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    date: '2025-04-27T10:15:00Z',
    total: 36.97,
    status: 'processing',
    items: [
      { id: 2, name: 'Truffle Arancini', quantity: 2, price: 12.99 },
      { id: 10, name: 'Chocolate Fondant', quantity: 1, price: 12.99 }
    ]
  },
  {
    id: 'ORD-003',
    customer: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '555-555-5555',
    date: '2025-04-26T18:45:00Z',
    total: 78.96,
    status: 'completed',
    items: [
      { id: 4, name: 'Filet Mignon', quantity: 1, price: 42.99 },
      { id: 5, name: 'Herb-Crusted Salmon', quantity: 1, price: 29.99 },
      { id: 9, name: 'Roasted Brussels Sprouts', quantity: 1, price: 10.99 }
    ]
  },
  {
    id: 'ORD-004',
    customer: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '555-222-3333',
    date: '2025-04-26T19:20:00Z',
    total: 49.98,
    status: 'cancelled',
    items: [
      { id: 6, name: 'Truffle Risotto', quantity: 2, price: 24.99 }
    ]
  }
];

const OrderManager = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter orders by status
  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'total') {
      return sortDirection === 'asc' ? a.total - b.total : b.total - a.total;
    }
    return 0;
  });

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} is now ${newStatus}`,
    });
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render order status badge
  const renderStatusBadge = (status: string) => {
    const badgeClass = getStatusBadgeClass(status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Order Management</h1>
        <p className="text-gray-500">View and manage customer orders</p>
      </div>

      {/* Filter and sort controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === 'all' 
                  ? 'bg-restaurant-green text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === 'pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('processing')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === 'processing' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === 'completed' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStatus === 'cancelled' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              <Clock size={16} className="inline mr-1" />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <button 
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={() => setOrders([...orders])}
              title="Refresh Orders"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {sortedOrders.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      {sortBy === 'date' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('total')}
                  >
                    <div className="flex items-center">
                      Total
                      {sortBy === 'total' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => toggleOrderDetails(order.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded order details */}
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Customer Information</h4>
                                <p className="text-sm text-gray-600">Name: {order.customer}</p>
                                <p className="text-sm text-gray-600">Email: {order.email}</p>
                                <p className="text-sm text-gray-600">Phone: {order.phone}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Order Status</h4>
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => handleStatusChange(order.id, 'pending')}
                                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                                      order.status === 'pending' 
                                        ? 'bg-yellow-500 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    Pending
                                  </button>
                                  <button 
                                    onClick={() => handleStatusChange(order.id, 'processing')}
                                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                                      order.status === 'processing' 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    Processing
                                  </button>
                                  <button 
                                    onClick={() => handleStatusChange(order.id, 'completed')}
                                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                                      order.status === 'completed' 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    Completed
                                  </button>
                                  <button 
                                    onClick={() => handleStatusChange(order.id, 'cancelled')}
                                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                                      order.status === 'cancelled' 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    Cancelled
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <h4 className="text-sm font-medium mb-2">Order Items</h4>
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Item
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subtotal
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {order.items.map((item) => (
                                  <tr key={item.id}>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                                      {item.name}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 text-center">
                                      {item.quantity}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 text-right">
                                      ${item.price.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 text-right">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-gray-50">
                                  <td colSpan={3} className="px-4 py-2 whitespace-nowrap text-xs font-medium text-right">
                                    Total:
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-right">
                                    ${order.total.toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
          <p className="text-gray-500">
            {filterStatus === 'all' 
              ? 'There are no orders in the system yet.' 
              : `There are no ${filterStatus} orders.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
