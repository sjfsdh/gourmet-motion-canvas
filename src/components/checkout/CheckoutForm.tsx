
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Truck, MapPin, User, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { createDatabaseOrder } from '@/services/databaseOrderService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  zipCode: string;
  paymentMethod: 'card' | 'cash' | 'demo';
  deliveryMethod: 'delivery' | 'pickup';
  notes: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutForm = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'demo',
    deliveryMethod: 'delivery',
    notes: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const createOrderMutation = useMutation({
    mutationFn: createDatabaseOrder,
    onSuccess: (order) => {
      console.log('Order created successfully:', order);
      queryClient.invalidateQueries({ queryKey: ['databaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['orderStats'] });
      setOrderId(order.id);
      setOrderPlaced(true);
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id} has been confirmed and saved to the database.`,
      });
    },
    onError: (error) => {
      console.error('Order creation error:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    // Basic validation - ALL FIELDS REQUIRED
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Full name is required';
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customerEmail)) {
        newErrors.customerEmail = 'Please enter a valid email address';
      }
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    }
    
    // Delivery validation - ALWAYS REQUIRED NOW
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    // Payment validation
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (formData.cardNumber.replace(/\s/g, '') !== '4242424242424242') {
        newErrors.cardNumber = 'For demo, use: 4242 4242 4242 4242';
      }
      
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      }
      
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Current cart:', cart);
    console.log('Form data:', formData);
    
    if (cart.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }

    const deliveryFee = formData.deliveryMethod === 'delivery' ? 4.99 : 0;
    const tax = cartTotal * 0.0825;
    const finalTotal = cartTotal + deliveryFee + tax;

    const orderData = {
      customer_name: formData.customerName,
      customer_email: formData.customerEmail,
      customer_phone: formData.customerPhone,
      total: finalTotal,
      status: 'pending' as const,
      payment_status: formData.paymentMethod === 'demo' ? 'paid' as const : 'pending' as const,
      payment_method: formData.paymentMethod,
      address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
      items: cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    console.log('Creating order with data:', orderData);
    createOrderMutation.mutate(orderData);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your order. Your order #{orderId} has been successfully placed and saved to our system.
          </p>
          <p className="text-gray-600 mb-6">
            Estimated {formData.deliveryMethod === 'delivery' ? 'delivery' : 'pickup'} time: 
            {formData.deliveryMethod === 'delivery' ? ' 35-45 minutes' : ' 15-20 minutes'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/menu'}
            className="bg-restaurant-green text-white px-8 py-3 rounded-lg hover:bg-restaurant-green/90"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const deliveryFee = formData.deliveryMethod === 'delivery' ? 4.99 : 0;
  const tax = cartTotal * 0.0825;
  const total = cartTotal + deliveryFee + tax;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="mr-2" />
              Customer Information *
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name * <span className="text-red-500">Required</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your full name"
                  required
                />
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address * <span className="text-red-500">Required</span>
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green ${errors.customerEmail ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your email"
                  required
                />
                {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number * <span className="text-red-500">Required</span>
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your phone number"
                  required
                />
                {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
              </div>
            </div>
          </div>

          {/* Delivery Information - ALWAYS REQUIRED */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information *</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className={`cursor-pointer p-4 border-2 rounded-lg ${formData.deliveryMethod === 'delivery' ? 'border-restaurant-green bg-restaurant-green/5' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={formData.deliveryMethod === 'delivery'}
                  onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <Truck className="mr-3" size={20} />
                  <div>
                    <div className="font-medium">Delivery</div>
                    <div className="text-sm text-gray-500">35-45 min • $4.99</div>
                  </div>
                </div>
              </label>
              
              <label className={`cursor-pointer p-4 border-2 rounded-lg ${formData.deliveryMethod === 'pickup' ? 'border-restaurant-green bg-restaurant-green/5' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={formData.deliveryMethod === 'pickup'}
                  onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <MapPin className="mr-3" size={20} />
                  <div>
                    <div className="font-medium">Pickup</div>
                    <div className="text-sm text-gray-500">15-20 min • Free</div>
                  </div>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address * <span className="text-red-500">Required</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Street address"
                  required
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City * <span className="text-red-500">Required</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="City"
                  required
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code * <span className="text-red-500">Required</span>
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="ZIP"
                  required
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2" />
              Payment Method *
            </h2>
            
            <div className="space-y-3 mb-4">
              <label className={`cursor-pointer p-4 border-2 rounded-lg flex items-center ${formData.paymentMethod === 'demo' ? 'border-restaurant-green bg-restaurant-green/5' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="demo"
                  checked={formData.paymentMethod === 'demo'}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Demo Payment (Testing) - RECOMMENDED</div>
                  <div className="text-sm text-gray-500">Use this for testing - no real payment required</div>
                </div>
              </label>
              
              <label className={`cursor-pointer p-4 border-2 rounded-lg flex items-center ${formData.paymentMethod === 'card' ? 'border-restaurant-green bg-restaurant-green/5' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Credit Card (Demo)</div>
                  <div className="text-sm text-gray-500">Use demo card: 4242 4242 4242 4242</div>
                </div>
              </label>
              
              <label className={`cursor-pointer p-4 border-2 rounded-lg flex items-center ${formData.paymentMethod === 'cash' ? 'border-restaurant-green bg-restaurant-green/5' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Cash on {formData.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}</div>
                  <div className="text-sm text-gray-500">Pay when you receive your order</div>
                </div>
              </label>
            </div>

            {formData.paymentMethod === 'card' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <div className="flex items-center text-blue-800 text-sm font-medium">
                    <AlertTriangle size={16} className="mr-2" />
                    Demo Card Details for Testing:
                  </div>
                  <div className="mt-2 text-blue-700 text-sm">
                    <strong>Card Number:</strong> 4242 4242 4242 4242<br/>
                    <strong>Expiry:</strong> 12/28<br/>
                    <strong>CVV:</strong> 123
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="4242 4242 4242 4242"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry *
                    </label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="12/28"
                    />
                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="123"
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={createOrderMutation.isPending || cart.length === 0}
              className="w-full bg-restaurant-green text-white py-3 rounded-lg mt-6 hover:bg-restaurant-green/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {createOrderMutation.isPending ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
            </button>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Demo Payment: Use "Demo Payment" option for testing</p>
              <p>Demo Card: 4242 4242 4242 4242 | 12/28 | 123</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
