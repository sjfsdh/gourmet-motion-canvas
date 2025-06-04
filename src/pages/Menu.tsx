
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import MenuGrid from '@/components/menu/MenuGrid';
import MenuSearch from '@/components/menu/MenuSearch';
import CategoryFilter from '@/components/menu/CategoryFilter';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { getAllMenuItems } from '@/services/menuService';
import { getAllCategories } from '@/services/categoryService';

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch menu items
  const { 
    data: menuItems = [], 
    isLoading: menuLoading, 
    error: menuError 
  } = useQuery({
    queryKey: ['menuItems'],
    queryFn: getAllMenuItems,
  });

  // Fetch categories
  const { 
    data: categories = [], 
    isLoading: categoriesLoading,
    error: categoriesError 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  // Transform categories to match the expected format (string id)
  const transformedCategories = useMemo(() => {
    const allCategory = { id: 'all', name: 'All Categories' };
    const categoryList = categories.map(cat => ({
      id: cat.name, // Use name as id for consistency
      name: cat.display_name || cat.name
    }));
    return [allCategory, ...categoryList];
  }, [categories]);

  // Filter menu items based on search and category
  const filteredItems = useMemo(() => {
    let filtered = menuItems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => {
        // Handle both category name and display_name
        const category = categories.find(cat => 
          cat.name === selectedCategory || cat.display_name === selectedCategory
        );
        
        if (category) {
          return item.category === category.name || item.category === category.display_name;
        }
        
        // Fallback to direct comparison
        return item.category === selectedCategory;
      });
    }

    return filtered;
  }, [menuItems, searchTerm, selectedCategory, categories]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const isLoading = menuLoading || categoriesLoading;
  const hasError = menuError || categoriesError;

  if (hasError) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Menu</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-12">
        <AnimatedSection animation="fadeIn">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Menu</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully crafted dishes made with the finest ingredients and authentic flavors.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={0.2}>
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-grow">
              <MenuSearch 
                value={searchTerm} 
                onChange={setSearchTerm} 
              />
            </div>
            <div className="lg:w-64">
              <CategoryFilter
                categories={transformedCategories}
                activeCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={0.4}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-restaurant-green"></div>
            </div>
          ) : (
            <>
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'Try adjusting your search or filter.' 
                      : 'Menu items will appear here once they are added.'
                    }
                  </p>
                  {(searchTerm || selectedCategory !== 'all') && (
                    <button
                      onClick={handleClearFilters}
                      className="mt-4 bg-restaurant-green text-white px-4 py-2 rounded-md hover:bg-restaurant-green/90"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {filteredItems.length} of {menuItems.length} items
                    {selectedCategory !== 'all' && (
                      <span className="ml-2">
                        in <strong>{transformedCategories.find(cat => cat.id === selectedCategory)?.name || selectedCategory}</strong>
                      </span>
                    )}
                  </div>
                  <MenuGrid 
                    items={filteredItems} 
                    activeCategory={selectedCategory}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              )}
            </>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Menu;
