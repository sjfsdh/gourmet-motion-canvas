
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomButton } from '@/components/ui/custom-button';
import { useRestaurantSettings } from '@/services/settingsService';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useRestaurantSettings();
  const orderData = location.state;

  if (!orderData) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order Placed Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you {orderData.customerName}! Your order has been received and is being prepared.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Order Number</h3>
                <p className="text-2xl font-bold text-restaurant-green">#{orderData.orderId}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Total Amount</h3>
                <p className="text-2xl font-bold text-gray-800">${orderData.total.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Status</h3>
                <p className="text-lg text-orange-600 font-semibold">Pending</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600 mr-3" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">Estimated Time</h4>
                <p className="text-gray-600">30-45 minutes</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
              <MapPin className="w-8 h-8 text-green-600 mr-3" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">Delivery</h4>
                <p className="text-gray-600">To your address</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-restaurant-green text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
                  1
                </div>
                <p className="text-gray-600">We've received your order and started preparation</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
                  2
                </div>
                <p className="text-gray-600">Our chefs are preparing your delicious meal</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
                  3
                </div>
                <p className="text-gray-600">Your order will be out for delivery soon</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center mb-2">
              <Phone className="w-5 h-5 text-yellow-600 mr-2" />
              <h4 className="font-semibold text-yellow-800">Need Help?</h4>
            </div>
            <p className="text-yellow-700 mb-2">
              If you have any questions about your order, please contact us:
            </p>
            <p className="font-semibold text-yellow-800">{settings.restaurant_phone}</p>
          </div>

          <div className="space-y-4">
            <CustomButton
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to Home
            </CustomButton>
            
            <CustomButton
              variant="outline"
              onClick={() => navigate('/menu')}
              className="w-full"
            >
              Continue Shopping
            </CustomButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
