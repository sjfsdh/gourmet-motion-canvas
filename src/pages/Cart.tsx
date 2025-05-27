
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomButton } from '@/components/ui/custom-button';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { useCart } from '@/hooks/useCart';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cart: cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    isLoading 
  } = useCart();

  const updateItemQuantity = (id: number, action: 'increase' | 'decrease') => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;
    
    if (action === 'increase') {
      updateQuantity(id, item.quantity + 1);
    } else if (action === 'decrease' && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const removeItem = (id: number) => {
    removeFromCart(id);
  };

  const subtotal = cartTotal;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container-custom">
          <AnimatedSection animation="fadeIn">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <CustomButton onClick={() => navigate('/menu')}>
                Browse Menu
              </CustomButton>
            </div>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <AnimatedSection animation="fadeIn">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Shopping Cart ({cartItems.length})</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Clear All
                  </button>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row"
                    >
                      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-6">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between mb-2">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-lg font-bold text-restaurant-green">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <p className="text-gray-500 text-sm mb-4 line-clamp-1">
                          {item.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateItemQuantity(item.id, 'decrease')}
                              disabled={item.quantity <= 1}
                              className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                                item.quantity <= 1 ? 'border-gray-200 text-gray-300' : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="mx-3 w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateItemQuantity(item.id, 'increase')}
                              className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 flex items-center"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Link to="/menu">
                  <CustomButton variant="outline" className="flex items-center">
                    <ArrowLeft size={16} className="mr-2" />
                    Continue Shopping
                  </CustomButton>
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <CustomButton
                  className="w-full justify-center mt-6"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                  <ArrowRight size={16} className="ml-2" />
                </CustomButton>
                
                <div className="mt-6 text-xs text-gray-500 text-center">
                  <p>Free delivery for orders over $50</p>
                  <p className="mt-2">We accept all major credit cards, PayPal and Apple Pay</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Cart;
