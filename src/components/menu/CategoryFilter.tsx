
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
        <button 
          className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          onClick={onMobileToggle}
        >
          <div className="flex items-center">
            <Filter size={18} className="mr-2 text-restaurant-green" />
            <span className="font-medium">Filter: {categories.find(cat => cat.id === activeCategory)?.name}</span>
          </div>
          <span className={`transition-transform duration-300 ${mobileFiltersOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
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
                  <div key={category.id} className="flex items-center space-x-2 p-2">
                    <RadioGroupItem value={category.id} id={`category-${category.id}-mobile`} />
                    <label 
                      htmlFor={`category-${category.id}-mobile`}
                      className={`text-sm font-medium flex-grow cursor-pointer ${
                        activeCategory === category.id ? 'text-restaurant-green' : 'text-gray-700'
                      }`}
                    >
                      {category.name}
                    </label>
                  </div>
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
      <Card className="sticky top-24 overflow-hidden">
        <div className="p-4 bg-restaurant-green text-white">
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
              <div key={category.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
                <RadioGroupItem value={category.id} id={`category-${category.id}`} />
                <label 
                  htmlFor={`category-${category.id}`}
                  className={`text-sm font-medium flex-grow cursor-pointer ${
                    activeCategory === category.id ? 'text-restaurant-green' : 'text-gray-700'
                  }`}
                >
                  {category.name}
                </label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryFilter;
