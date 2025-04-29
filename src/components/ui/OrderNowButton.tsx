
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { MenuItem } from '@/services/menuService';

interface OrderNowButtonProps {
  item: MenuItem;
  variant?: 'default' | 'small' | 'large';
}

export const OrderNowButton: React.FC<OrderNowButtonProps> = ({ item, variant = 'default' }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any parent link from being followed
    addToCart(item);
    navigate('/checkout');
  };
  
  // Style configurations based on variant
  const getButtonClasses = () => {
    switch (variant) {
      case 'small':
        return 'px-3 py-1 text-sm';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`bg-restaurant-terracotta text-white rounded-md flex items-center justify-center font-medium hover:bg-restaurant-terracotta/90 ${getButtonClasses()}`}
      onClick={handleOrderNow}
    >
      <ShoppingCart size={variant === 'small' ? 14 : variant === 'large' ? 20 : 16} className="mr-1" />
      Order Now
    </motion.button>
  );
};

export default OrderNowButton;
