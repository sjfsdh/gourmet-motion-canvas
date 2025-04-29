
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { MenuItem } from '@/services/menuService';

interface AddToCartButtonProps {
  item: MenuItem;
  variant?: 'default' | 'small' | 'large';
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ item, variant = 'default' }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any parent link from being followed
    addToCart(item);
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
      className={`bg-restaurant-green text-white rounded-md flex items-center justify-center font-medium hover:bg-restaurant-green/90 ${getButtonClasses()}`}
      onClick={handleAddToCart}
    >
      <ShoppingCart size={variant === 'small' ? 14 : variant === 'large' ? 20 : 16} className="mr-1" />
      Add to Cart
    </motion.button>
  );
};

export default AddToCartButton;
