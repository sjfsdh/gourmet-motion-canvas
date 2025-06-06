
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import AnimatedSection from '@/components/animations/AnimatedSection';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal } = useCart();

  // If cart is empty, redirect to menu
  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <AnimatedSection animation="fadeIn">
          <div className="text-center p-8">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to your cart first!</p>
            <CustomButton onClick={() => navigate('/menu')}>
              Browse Menu
            </CustomButton>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  // Redirect to the actual checkout form
  React.useEffect(() => {
    navigate('/checkout-form');
  }, [navigate]);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p>Redirecting to checkout...</p>
      </div>
    </div>
  );
};

export default Checkout;
