
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Clock, Home } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '@/components/animations/AnimatedSection';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <AnimatedSection animation="fadeIn">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={40} className="text-green-600" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Placed Successfully!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your order. We've received your payment and your delicious meal is being prepared.
            </p>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package size={24} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Order Confirmed</h3>
                  <p className="text-sm text-gray-600">
                    Your order has been confirmed and sent to our kitchen.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock size={24} className="text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Preparing</h3>
                  <p className="text-sm text-gray-600">
                    Our chefs are carefully preparing your order.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Home size={24} className="text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Your order will be delivered fresh and hot.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <CustomButton
                onClick={() => navigate('/account')}
                className="w-full md:w-auto"
              >
                View Order Status
              </CustomButton>
              
              <div className="text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-restaurant-green hover:underline"
                >
                  Return to Home
                </button>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You'll receive an email confirmation shortly with your order details and tracking information.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default OrderSuccess;
