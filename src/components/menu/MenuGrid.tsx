
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import MenuItem from './MenuItem';
import { CustomButton } from '@/components/ui/custom-button';

interface MenuGridProps {
  items: any[];
  activeCategory: string;
  onAddToCart: (item: any) => void;
  onClearFilters: () => void;
  showFeatured?: boolean;
}

const MenuGrid: React.FC<MenuGridProps> = ({ 
  items, 
  activeCategory, 
  onAddToCart, 
  onClearFilters,
  showFeatured = false 
}) => {
  // Only filter if we have items
  const filteredItems = items && items.length > 0 ? (
    showFeatured ? 
      items.filter(item => item.featured) : 
      items.filter(item => activeCategory === 'all' || item.category === activeCategory)
  ) : [];
  
  if (!filteredItems || filteredItems.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Search size={24} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">No items found</h3>
        <p className="text-gray-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <CustomButton onClick={onClearFilters}>
            Clear Filters
          </CustomButton>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div>
      {showFeatured && filteredItems.length > 0 && (
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold mb-6 flex items-center"
        >
          <span className="border-b-2 border-restaurant-terracotta pb-1">Featured Items</span>
        </motion.h2>
      )}
      
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MenuGrid;
