
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Package, CreditCard, LogOut, ChevronRight, Edit, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/animations/AnimatedSection';
import StaggeredItems from '@/components/animations/StaggeredItems';

// Profile Pages
const ProfileInfo = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    birthday: '1990-05-15'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully."
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="text-restaurant-green hover:text-restaurant-green/80 flex items-center"
          >
            <Edit size={18} className="mr-1" /> Edit
          </motion.button>
        )}
      </div>

      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                />
              </div>
              
              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={form.birthday}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                <p className="mt-1">{form.firstName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                <p className="mt-1">{form.lastName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1">{form.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                <p className="mt-1">{form.phone}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Birthday</h3>
                <p className="mt-1">{new Date(form.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Addresses Page
const Addresses = () => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      isDefault: true
    },
    {
      id: 2,
      type: 'Work',
      address: '456 Office Park',
      city: 'New York',
      state: 'NY',
      zipCode: '10023',
      isDefault: false
    }
  ]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<typeof addresses[0] | null>(null);

  const handleDeleteAddress = (id: number) => {
    setAddresses(prev => prev.filter(address => address.id !== id));
    toast({
      title: "Address Deleted",
      description: "The address has been removed from your account."
    });
  };

  const handleSetDefault = (id: number) => {
    setAddresses(prev => prev.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
    toast({
      title: "Default Address Updated",
      description: "Your default address has been updated."
    });
  };

  const handleEditAddress = (address: typeof addresses[0]) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAddress) {
      // Edit existing address
      setAddresses(prev => prev.map(address => 
        address.id === editingAddress.id ? editingAddress : address
      ));
      toast({
        title: "Address Updated",
        description: "Your address has been updated successfully."
      });
    } else {
      // Add new address
      const newAddress = {
        id: Date.now(),
        type: 'Home',
        address: '789 New St',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        isDefault: addresses.length === 0
      };
      
      setAddresses(prev => [...prev, newAddress]);
      toast({
        title: "Address Added",
        description: "Your new address has been added successfully."
      });
    }
    
    setShowAddressModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Addresses</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddAddress}
            className="btn-outline py-2"
          >
            <Plus size={16} className="mr-1" /> Add Address
          </motion.button>
        </div>
        
        <div className="p-6">
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
              <button 
                onClick={handleAddAddress}
                className="btn-primary"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <StaggeredItems containerClassName="space-y-4" animation="fadeIn">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="border rounded-lg p-4 hover:border-restaurant-green/50 transition-colors relative"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="font-semibold mr-2">{address.type}</span>
                        {address.isDefault && (
                          <span className="bg-restaurant-green text-white text-xs px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{address.address}</p>
                      <p className="text-gray-700">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditAddress(address)}
                        className="text-gray-500 hover:text-restaurant-green p-1"
                      >
                        <Edit size={16} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-gray-500 hover:text-red-500 p-1"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                  
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="mt-3 text-sm text-restaurant-green hover:text-restaurant-green/80"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </StaggeredItems>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg w-full max-w-md"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleSaveAddress} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Name
                    </label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                      value={editingAddress?.type || 'Home'}
                      onChange={(e) => editingAddress && setEditingAddress({...editingAddress, type: e.target.value})}
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                      value={editingAddress?.address || ''}
                      onChange={(e) => editingAddress && setEditingAddress({...editingAddress, address: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                        value={editingAddress?.city || ''}
                        onChange={(e) => editingAddress && setEditingAddress({...editingAddress, city: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                        value={editingAddress?.state || ''}
                        onChange={(e) => editingAddress && setEditingAddress({...editingAddress, state: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                      value={editingAddress?.zipCode || ''}
                      onChange={(e) => editingAddress && setEditingAddress({...editingAddress, zipCode: e.target.value})}
                      required
                    />
                  </div>
                  
                  {!editingAddress?.isDefault && (
                    <div className="flex items-center">
                      <input
                        id="setDefault"
                        type="checkbox"
                        className="h-4 w-4 text-restaurant-green focus:ring-restaurant-green border-gray-300 rounded"
                        checked={editingAddress?.isDefault || false}
                        onChange={(e) => editingAddress && setEditingAddress({...editingAddress, isDefault: e.target.checked})}
                      />
                      <label htmlFor="setDefault" className="ml-2 block text-sm text-gray-700">
                        Set as default address
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Order History Page
const OrderHistory = () => {
  const navigate = useNavigate();
  
  // Mock order data
  const orders = [
    {
      id: '#ORD-2023-1201',
      date: 'December 1, 2023',
      total: 79.97,
      status: 'Delivered',
      items: [
        { id: 1, name: 'Truffle Risotto', quantity: 1, price: 24.99 },
        { id: 5, name: 'Herb-Crusted Salmon', quantity: 2, price: 29.99 }
      ]
    },
    {
      id: '#ORD-2023-1115',
      date: 'November 15, 2023',
      total: 52.97,
      status: 'Delivered',
      items: [
        { id: 10, name: 'Chocolate Fondant', quantity: 2, price: 12.99 },
        { id: 4, name: 'Filet Mignon', quantity: 1, price: 42.99 }
      ]
    },
    {
      id: '#ORD-2023-1030',
      date: 'October 30, 2023',
      total: 68.97,
      status: 'Delivered',
      items: [
        { id: 6, name: 'Duck Confit', quantity: 1, price: 32.99 },
        { id: 13, name: 'Signature Cocktail', quantity: 2, price: 14.99 },
        { id: 8, name: 'Truffle Fries', quantity: 1, price: 9.99 }
      ]
    }
  ];

  const handleReorder = (orderId: string) => {
    navigate('/cart');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Order History</h2>
      </div>
      
      <div className="p-6">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any orders yet.</p>
            <Link to="/menu" className="btn-primary">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <StaggeredItems key={order.id} containerClassName="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{order.id}</h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReorder(order.id)}
                      className="btn-outline py-1 px-3"
                    >
                      Reorder
                    </motion.button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-medium mb-2">Order Items</h4>
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity} × {item.name}
                        </span>
                        <span className="text-gray-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggeredItems>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Payment Methods Page
const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'credit',
      cardNumber: '**** **** **** 4242',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'credit',
      cardNumber: '**** **** **** 5555',
      expiryDate: '09/24',
      isDefault: false
    }
  ]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-outline py-2"
        >
          <Plus size={16} className="mr-1" /> Add Payment Method
        </motion.button>
      </div>
      
      <div className="p-6">
        <StaggeredItems containerClassName="space-y-4" animation="fadeIn">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="border rounded-lg p-4 hover:border-restaurant-green/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="font-semibold mr-2">
                      {method.type === 'credit' ? 'Credit Card' : 'PayPal'}
                    </span>
                    {method.isDefault && (
                      <span className="bg-restaurant-green text-white text-xs px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  {method.type === 'credit' && (
                    <>
                      <p className="text-gray-700">{method.cardNumber}</p>
                      <p className="text-gray-700">Expires: {method.expiryDate}</p>
                    </>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-500 hover:text-restaurant-green p-1"
                  >
                    <Edit size={16} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-500 hover:text-red-500 p-1"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>
              
              {!method.isDefault && (
                <button
                  className="mt-3 text-sm text-restaurant-green hover:text-restaurant-green/80"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </StaggeredItems>
      </div>
    </div>
  );
};

// Main Account Page
const Account = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current tab from URL or default to profile
  const currentPath = location.pathname;
  const currentTab = currentPath.includes('addresses') ? 'addresses' 
    : currentPath.includes('orders') ? 'orders'
    : currentPath.includes('payment') ? 'payment'
    : 'profile';
  
  // Navigation items
  const navigationItems = [
    { name: 'Personal Info', path: '/account', icon: User, id: 'profile' },
    { name: 'Addresses', path: '/account/addresses', icon: MapPin, id: 'addresses' },
    { name: 'Order History', path: '/account/orders', icon: Package, id: 'orders' },
    { name: 'Payment Methods', path: '/account/payment', icon: CreditCard, id: 'payment' }
  ];
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-12">
        <AnimatedSection animation="fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">My Account</h1>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="slideInLeft" className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-restaurant-green/10 flex items-center justify-center text-restaurant-green mr-3">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="font-semibold">John Doe</h2>
                    <p className="text-sm text-gray-600">john.doe@example.com</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.id}>
                      <Link 
                        to={item.path}
                        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                          currentTab === item.id
                            ? 'bg-restaurant-green text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <item.icon size={18} className="mr-3" />
                        <span>{item.name}</span>
                        <ChevronRight size={16} className="ml-auto" />
                      </Link>
                    </li>
                  ))}
                  
                  <li className="pt-4 mt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        navigate('/');
                        // Handle logout logic here
                      }}
                      className="flex items-center text-red-500 hover:text-red-700 px-4 py-2 rounded-md w-full text-left"
                    >
                      <LogOut size={18} className="mr-3" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </AnimatedSection>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<ProfileInfo />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/payment" element={<PaymentMethods />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
