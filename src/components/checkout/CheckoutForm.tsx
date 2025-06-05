
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard, MapPin, Phone, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { CustomButton } from '@/components/ui/custom-button';
import { createDatabaseOrder } from '@/services/databaseOrderService';
import { useRestaurantSettings } from '@/services/settingsService';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const { settings } = useRestaurantSettings();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'card'
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (cart.length === 0) {
      newErrors.cart = 'Your cart is empty';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);

    try {
      // Create order in database
      const orderData = {
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim(),
        total: cartTotal,
        status: 'pending' as const,
        payment_status: 'pending' as const,
        payment_method: formData.paymentMethod,
        address: formData.address.trim(),
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const order = await createDatabaseOrder(orderData);
      
      // Clear the cart after successful order
      await clearCart();
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id} has been received and is being processed.`,
        duration: 5000,
      });

      // Navigate to order success page
      navigate('/order-success', { 
        state: { 
          orderId: order.id,
          customerName: formData.name,
          total: cartTotal 
        } 
      });

    } catch (error) {
      console.error('Order creation error:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cartTotal;
  const tax = 0; // No tax as requested
  const delivery = 0; // Will be configurable from admin panel later
  const total = subtotal + tax + delivery;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to your cart first!</p>
          <CustomButton onClick={() => navigate('/menu')}>
            Browse Menu
          </CustomButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Order Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <User className="mr-2" size={20} />
                  Customer Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green transition-all resize-none ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your complete address"
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <CreditCard className="mr-2" size={20} />
                  Payment Method
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <CreditCard size={20} className="mr-2 text-gray-600" />
                    <span>Credit/Debit Card (Demo)</span>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Demo Mode:</strong> This is a test payment. No actual charges will be made.
                    </p>
                  </div>
                )}
              </div>

              {errors.cart && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{errors.cart}</p>
                </div>
              )}

              <CustomButton
                type="submit"
                className="w-full justify-center py-4 text-lg"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Order...' : `Place Order - $${total.toFixed(2)}`}
              </CustomButton>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.quantity} ×</p>
                    <p className="text-restaurant-green font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery:</span>
                <span>{delivery === 0 ? 'Free' : `$${delivery.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
                <span>Total:</span>
                <span className="text-restaurant-green">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutForm;
