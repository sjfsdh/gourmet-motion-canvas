
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isMobile?: boolean;
  mobileFiltersOpen?: boolean;
  onMobileToggle?: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  isMobile = false,
  mobileFiltersOpen = false,
  onMobileToggle
}) => {
  if (isMobile) {
    return (
      <div className="lg:hidden">
        <motion.button 
          className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          onClick={onMobileToggle}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <Filter size={18} className="mr-2 text-restaurant-green" />
            <span className="font-medium">Filter: {categories.find(cat => cat.id === activeCategory)?.name}</span>
          </div>
          <motion.span 
            className="text-sm"
            animate={{ rotate: mobileFiltersOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </motion.button>
        
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white mt-2 rounded-lg shadow-md overflow-hidden border border-gray-100"
            >
              <RadioGroup 
                value={activeCategory} 
                onValueChange={onCategoryChange}
                className="p-2"
              >
                {categories.map((category) => (
                  <motion.div 
                    key={category.id} 
                    className="flex items-center space-x-2 p-2"
                    whileHover={{ backgroundColor: 'rgba(45, 93, 59, 0.05)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <RadioGroupItem value={category.id} id={`category-${category.id}-mobile`} />
                    <label 
                      htmlFor={`category-${category.id}-mobile`}
                      className={`text-sm font-medium flex-grow cursor-pointer ${
                        activeCategory === category.id ? 'text-restaurant-green' : 'text-gray-700'
                      }`}
                    >
                      {category.name}
                    </label>
                  </motion.div>
                ))}
              </RadioGroup>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="hidden lg:block w-64 shrink-0">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="sticky top-24 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-restaurant-green to-restaurant-green/90 text-white">
            <h2 className="text-xl font-semibold flex items-center">
              <Filter size={18} className="mr-2" />
              Categories
            </h2>
          </div>
          <CardContent className="p-4">
            <RadioGroup 
              value={activeCategory} 
              onValueChange={onCategoryChange}
              className="space-y-1"
            >
              {categories.map((category) => (
                <motion.div 
                  key={category.id} 
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50"
                  whileHover={{ x: 5 }}
                  animate={{ 
                    backgroundColor: activeCategory === category.id ? 'rgba(45, 93, 59, 0.1)' : 'transparent' 
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <RadioGroupItem value={category.id} id={`category-${category.id}`} />
                  <label 
                    htmlFor={`category-${category.id}`}
                    className={`text-sm font-medium flex-grow cursor-pointer ${
                      activeCategory === category.id ? 'text-restaurant-green' : 'text-gray-700'
                    }`}
                  >
                    {category.name}
                  </label>
                </motion.div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CategoryFilter;
