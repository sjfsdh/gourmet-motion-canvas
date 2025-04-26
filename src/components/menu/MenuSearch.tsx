
import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const MenuSearch: React.FC<MenuSearchProps> = ({ 
  value, 
  onChange, 
  className = '',
  placeholder = 'Search our menu...'
}) => {
  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-restaurant-green/30 transition-all duration-200"
          aria-label="Search menu items"
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        {value && (
          <motion.button 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => onChange('')}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-200"
            aria-label="Clear search"
          >
            <X size={18} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default MenuSearch;
