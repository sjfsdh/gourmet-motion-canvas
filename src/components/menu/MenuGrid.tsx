
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import MenuItem from './MenuItem';
import StaggeredItems from '@/components/animations/StaggeredItems';
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
  const filteredItems = showFeatured ? items.filter(item => item.featured) : items.filter(item => !item.featured);
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Search size={24} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">No items found</h3>
        <p className="text-gray-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
        <CustomButton onClick={onClearFilters}>
          Clear Filters
        </CustomButton>
      </div>
    );
  }

  return (
    <div>
      {showFeatured && (
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="border-b-2 border-restaurant-terracotta pb-1">Featured Items</span>
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StaggeredItems animation="fadeIn">
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </StaggeredItems>
      </div>
    </div>
  );
};

export default MenuGrid;
