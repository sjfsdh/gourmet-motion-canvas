
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { useToast } from '@/hooks/use-toast';
import MenuSearch from '@/components/menu/MenuSearch';
import CategoryFilter from '@/components/menu/CategoryFilter';
import MenuGrid from '@/components/menu/MenuGrid';
import { getAllMenuItems } from '@/services/menuService';
import { getAllCategories } from '@/services/categoryService';
import { useQuery } from '@tanstack/react-query';

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayItems, setDisplayItems] = useState([]);
  
  // Fetch menu items from the database
  const { data: menuItems = [], isLoading, error } = useQuery({
    queryKey: ['menuItems'],
    queryFn: getAllMenuItems,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Fetch categories from database
  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Transform categories data to include 'all' option
  const categories = [
    { id: 'all', name: 'All Items' },
    ...categoriesData.map(cat => ({ id: cat.name, name: cat.display_name }))
  ];
  
  // Update displayItems whenever menuItems, activeCategory or searchTerm changes
  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      console.log(`Successfully loaded ${menuItems.length} menu items`);
      const filtered = menuItems.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = searchTerm === '' || 
                            item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const isInStock = item.in_stock !== false; // Show items that are in stock or have no stock info
        return matchesSearch && matchesCategory && isInStock;
      });
      
      console.log(`Filtered to ${filtered.length} items for category: ${activeCategory}, search: "${searchTerm}"`);
      setDisplayItems(filtered);
    } else {
      setDisplayItems([]);
    }
  }, [activeCategory, searchTerm, menuItems]);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveCategory('all');
  };

  return (
    <div className="bg-gray-50">
      {/* Menu Header */}
      <section className="bg-restaurant-green py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="blob absolute top-0 right-0 w-96 h-96 bg-blue-500 -mr-24 -mt-24"></div>
          <div className="blob-2 absolute bottom-0 left-0 w-96 h-96 bg-restaurant-terracotta -ml-24 -mb-24"></div>
        </div>
        
        <div className="container-custom text-center relative z-10">
          <AnimatedSection animation="fadeIn">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">Our Menu</h1>
            <div className="w-24 h-1 bg-restaurant-terracotta mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-lg text-white/80 mb-8">
              Explore our carefully crafted dishes, made with the finest ingredients and passion for culinary excellence.
            </p>
            
            <MenuSearch
              value={searchTerm}
              onChange={setSearchTerm}
              className="max-w-md mx-auto hidden md:block"
            />
          </AnimatedSection>
        </div>
      </section>

      <div className="container-custom py-12">
        <MenuSearch
          value={searchTerm}
          onChange={setSearchTerm}
          className="md:hidden mb-6"
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            isMobile={true}
            mobileFiltersOpen={mobileFiltersOpen}
            onMobileToggle={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          />

          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <div className="flex-grow">
            <AnimatedSection animation="fadeIn">
              {/* Featured items - only show when no filters applied */}
              {activeCategory === 'all' && !searchTerm && !isLoading && !error && menuItems.length > 0 && (
                <div className="mb-10">
                  <MenuGrid
                    items={menuItems.filter(item => item.featured && item.in_stock !== false) || []}
                    activeCategory={activeCategory}
                    onClearFilters={handleClearFilters}
                    showFeatured={true}
                    isLoading={isLoading}
                    error={error}
                  />
                </div>
              )}

              {/* Regular menu items */}
              <motion.div
                key={activeCategory + searchTerm}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <MenuGrid
                  items={displayItems}
                  activeCategory={activeCategory}
                  onClearFilters={handleClearFilters}
                  showFeatured={false}
                  isLoading={isLoading}
                  error={error}
                />
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
