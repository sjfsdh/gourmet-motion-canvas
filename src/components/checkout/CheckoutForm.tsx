
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/services/orderService';
import { sendOrderConfirmationEmail } from '@/services/emailService';
import { CustomButton } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: user?.email || '',
    customerPhone: '',
    address: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order
      const orderData = {
        user_id: user?.id || 'guest',
        user_email: formData.customerEmail,
        user_name: formData.customerName,
        items: cart,
        total: cartTotal,
        status: 'pending' as const,
        delivery_address: formData.address,
        phone: formData.customerPhone,
        notes: formData.notes
      };

      const newOrder = createOrder(orderData);

      // Send order confirmation email
      try {
        await sendOrderConfirmationEmail({
          customerEmail: formData.customerEmail,
          customerName: formData.customerName,
          orderId: newOrder.id,
          orderItems: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total: cartTotal
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't block the order process if email fails
      }

      // Clear cart
      await clearCart();

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${newOrder.id} has been confirmed.`,
      });

      // Navigate to success page
      navigate('/order-success', {
        state: {
          orderId: newOrder.id,
          customerName: formData.customerName,
          total: cartTotal
        }
      });

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <CustomButton onClick={() => navigate('/menu')}>
            Browse Menu
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Form */}
              <div>
                <h2 className="text-lg font-semibold mb-6">Delivery Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <Textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full delivery address"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <Textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for your order"
                      rows={2}
                    />
                  </div>

                  <CustomButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Placing Order...' : `Place Order - $${cartTotal.toFixed(2)}`}
                  </CustomButton>
                </form>
              </div>

              {/* Order Summary */}
              <div>
                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 mt-6 pt-6">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutForm;
