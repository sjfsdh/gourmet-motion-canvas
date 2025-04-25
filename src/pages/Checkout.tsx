
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/animations/AnimatedSection';

// Form state
interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  deliveryInstructions: string;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: 'credit' | 'paypal';
  promoCode: string;
  saveInfo: boolean;
}

// Mock cart data for summary
const cartItems = [
  {
    id: 1,
    name: 'Truffle Risotto',
    price: 24.99,
    quantity: 1
  },
  {
    id: 5,
    name: 'Herb-Crusted Salmon',
    price: 29.99,
    quantity: 2
  }
];

const Checkout = () => {
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Form state
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    deliveryInstructions: '',
    deliveryMethod: 'delivery',
    paymentMethod: 'credit',
    promoCode: '',
    saveInfo: false
  });
  
  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.0825; // 8.25% tax
  const deliveryFee = form.deliveryMethod === 'delivery' ? 4.99 : 0;
  const discount = form.promoCode === 'WELCOME15' ? subtotal * 0.15 : 0;
  const total = subtotal + tax + deliveryFee - discount;

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Apply promo code
    if (name === 'promoCode' && value === 'WELCOME15') {
      toast({
        title: "Promo Code Applied",
        description: "15% discount has been applied to your order."
      });
    }
  };
  
  // Handle delivery method change
  const handleDeliveryMethodChange = (method: 'delivery' | 'pickup') => {
    setForm(prev => ({ ...prev, deliveryMethod: method }));
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (method: 'credit' | 'paypal') => {
    setForm(prev => ({ ...prev, paymentMethod: method }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    setTimeout(() => {
      setOrderPlaced(true);
      toast({
        title: "Order Placed Successfully!",
        description: "Check your email for order confirmation."
      });
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-12">
        <AnimatedSection animation="fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>
        </AnimatedSection>

        {orderPlaced ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center"
          >
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Thank You for Your Order!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been received and is being processed. You will receive an email confirmation shortly.
            </p>
            <p className="font-semibold mb-4">Order #: 10293847</p>
            <p className="text-gray-600 mb-6">
              Estimated delivery time: 35-45 minutes
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Return to Home
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                {/* Contact Information */}
                <AnimatedSection animation="slideInLeft" className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Contact Information</h2>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                      />
                    </div>
                  </div>
                </AnimatedSection>

                {/* Delivery Details */}
                <AnimatedSection animation="slideInLeft" delay={0.2} className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Delivery Method</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex gap-4 mb-6">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDeliveryMethodChange('delivery')}
                        className={`flex-1 py-3 px-4 rounded-md border-2 ${
                          form.deliveryMethod === 'delivery'
                            ? 'border-restaurant-green bg-restaurant-green/5'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                            form.deliveryMethod === 'delivery'
                              ? 'border-restaurant-green'
                              : 'border-gray-400'
                          }`}>
                            {form.deliveryMethod === 'delivery' && (
                              <div className="w-2 h-2 rounded-full bg-restaurant-green"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">Delivery</div>
                            <div className="text-sm text-gray-500">35-45 min</div>
                          </div>
                        </div>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDeliveryMethodChange('pickup')}
                        className={`flex-1 py-3 px-4 rounded-md border-2 ${
                          form.deliveryMethod === 'pickup'
                            ? 'border-restaurant-green bg-restaurant-green/5'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                            form.deliveryMethod === 'pickup'
                              ? 'border-restaurant-green'
                              : 'border-gray-400'
                          }`}>
                            {form.deliveryMethod === 'pickup' && (
                              <div className="w-2 h-2 rounded-full bg-restaurant-green"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">Pickup</div>
                            <div className="text-sm text-gray-500">15-20 min</div>
                          </div>
                        </div>
                      </motion.button>
                    </div>

                    {form.deliveryMethod === 'delivery' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>

                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>

                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={form.zipCode}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                            Delivery Instructions (Optional)
                          </label>
                          <textarea
                            id="deliveryInstructions"
                            name="deliveryInstructions"
                            value={form.deliveryInstructions}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          ></textarea>
                        </div>
                      </div>
                    )}
                  </div>
                </AnimatedSection>

                {/* Payment Method */}
                <AnimatedSection animation="slideInLeft" delay={0.4} className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Payment Method</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex gap-4 mb-6">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePaymentMethodChange('credit')}
                        className={`flex-1 py-3 px-4 rounded-md border-2 ${
                          form.paymentMethod === 'credit'
                            ? 'border-restaurant-green bg-restaurant-green/5'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                            form.paymentMethod === 'credit'
                              ? 'border-restaurant-green'
                              : 'border-gray-400'
                          }`}>
                            {form.paymentMethod === 'credit' && (
                              <div className="w-2 h-2 rounded-full bg-restaurant-green"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">Credit Card</div>
                          </div>
                        </div>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePaymentMethodChange('paypal')}
                        className={`flex-1 py-3 px-4 rounded-md border-2 ${
                          form.paymentMethod === 'paypal'
                            ? 'border-restaurant-green bg-restaurant-green/5'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                            form.paymentMethod === 'paypal'
                              ? 'border-restaurant-green'
                              : 'border-gray-400'
                          }`}>
                            {form.paymentMethod === 'paypal' && (
                              <div className="w-2 h-2 rounded-full bg-restaurant-green"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">PayPal</div>
                          </div>
                        </div>
                      </motion.button>
                    </div>

                    {form.paymentMethod === 'credit' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>

                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            placeholder="MM/YY"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>

                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            placeholder="123"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                          />
                        </div>
                      </div>
                    )}

                    {form.paymentMethod === 'paypal' && (
                      <div className="bg-blue-50 p-4 rounded-md text-center">
                        <p className="text-gray-700">
                          You will be redirected to PayPal to complete your payment after placing the order.
                        </p>
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <AnimatedSection animation="slideInRight" className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.quantity} × {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      {form.deliveryMethod === 'delivery' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Fee</span>
                          <span>${deliveryFee.toFixed(2)}</span>
                        </div>
                      )}
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount (15%)</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Promo Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="promoCode"
                        name="promoCode"
                        value={form.promoCode}
                        onChange={handleChange}
                        placeholder="Enter code"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                      />
                      <button
                        type="button"
                        className="bg-restaurant-green text-white px-4 py-2 rounded-r-md"
                      >
                        Apply
                      </button>
                    </div>
                    {form.promoCode === 'WELCOME15' && (
                      <p className="text-green-600 text-sm mt-1 flex items-center">
                        <Check size={14} className="mr-1" /> Promo code applied successfully!
                      </p>
                    )}
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-restaurant-green text-xl">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={form.saveInfo}
                        onChange={handleChange}
                        className="mr-2 h-4 w-4 text-restaurant-green focus:ring-restaurant-green border-gray-300 rounded"
                      />
                      <span className="text-gray-700">Save my information for future orders</span>
                    </label>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="btn-primary w-full"
                  >
                    Place Order
                  </motion.button>
                  
                  <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                    <Info size={14} className="mr-1" />
                    <span>You won't be charged until you place the order</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
