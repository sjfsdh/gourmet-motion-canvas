
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

interface MenuItemProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    featured?: boolean;
    category?: string;
  };
  onAddToCart?: (item: any) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onAddToCart }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log('MenuItem handleAddToCart called with:', item);
    // Use the hook's addToCart function
    addToCart(item);
    
    // Also call the prop function if provided (for backward compatibility)
    if (onAddToCart) {
      onAddToCart(item);
    }
  };
  
  const handleOrderNow = () => {
    // Add to cart first
    addToCart(item);
    
    // Navigate to checkout
    navigate('/checkout');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
        {item.featured && (
          <div className="absolute top-3 right-3 bg-restaurant-terracotta text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
            Featured
          </div>
        )}
        {item.category && (
          <div className="absolute bottom-3 left-3 bg-blue-600/80 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
            {item.category}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex justify-between items-start">
          <h3 className="text-xl font-semibold">{item.name}</h3>
          <div className="text-xl font-bold text-restaurant-green">${item.price.toFixed(2)}</div>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
        <div className="flex space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
            <CustomButton
              variant="secondary"
              className="w-full"
              onClick={handleAddToCart}
              icon={<ShoppingCart size={18} />}
            >
              Add to Cart
            </CustomButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CustomButton
              onClick={handleOrderNow}
              className="px-4 whitespace-nowrap"
            >
              Order Now
            </CustomButton>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;
