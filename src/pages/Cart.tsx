
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/animations/AnimatedSection';

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    name: 'Truffle Risotto',
    price: 24.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    name: 'Herb-Crusted Salmon',
    price: 29.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const { toast } = useToast();

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.0825; // 8.25% tax
  const deliveryFee = 4.99;
  const total = subtotal + tax + deliveryFee;

  // Update item quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart."
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-12">
        <AnimatedSection animation="fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Cart</h1>
        </AnimatedSection>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Order Items</h2>
                </div>

                <AnimatePresence>
                  {cartItems.map(item => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      exit="exit"
                      className="p-6 border-b border-gray-200 flex items-center"
                    >
                      <div className="w-24 h-24 rounded-md overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="ml-6 flex-grow">
                        <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                        <p className="text-restaurant-green font-medium">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex items-center border rounded-md mr-4">
                          <motion.button
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1"
                          >
                            <Minus size={16} />
                          </motion.button>
                          
                          <span className="px-4 py-1 min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          
                          <motion.button
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1"
                          >
                            <Plus size={16} />
                          </motion.button>
                        </div>
                        
                        <motion.button
                          whileHover={{ color: '#ef4444' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          className="text-gray-400"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <AnimatedSection animation="slideInRight" className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-restaurant-green text-xl">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/checkout"
                      className="btn-primary w-full flex items-center justify-center mb-4"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={18} className="ml-2" />
                    </Link>
                  </motion.div>
                  
                  <Link
                    to="/menu"
                    className="text-restaurant-green font-medium flex items-center justify-center hover:underline"
                  >
                    <ArrowRight size={16} className="mr-1 transform rotate-180" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        ) : (
          <AnimatedSection animation="fadeIn" className="text-center py-16">
            <div className="mx-auto w-20 h-20 mb-6 text-gray-400">
              <ShoppingBag size={80} />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/menu" className="btn-primary">
              Browse Menu
            </Link>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default Cart;
