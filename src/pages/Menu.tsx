
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { useToast } from '@/hooks/use-toast';
import MenuSearch from '@/components/menu/MenuSearch';
import CategoryFilter from '@/components/menu/CategoryFilter';
import MenuGrid from '@/components/menu/MenuGrid';
import { getAllMenuItems } from '@/services/menuService';
import { useQuery } from '@tanstack/react-query';

// Menu categories
const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'starters', name: 'Starters' },
  { id: 'mains', name: 'Mains' },
  { id: 'sides', name: 'Sides' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Drinks' }
];

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayItems, setDisplayItems] = useState([]);
  const { toast } = useToast();
  
  // Fetch menu items from the database
  const { data: menuItems, isLoading, error } = useQuery({
    queryKey: ['menuItems'],
    queryFn: getAllMenuItems
  });
  
  // When adding to cart, update localStorage
  const handleAddToCart = (item) => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item is already in cart
    const itemIndex = existingCart.findIndex(cartItem => cartItem.id === item.id);
    
    if (itemIndex !== -1) {
      // Item exists, increment quantity
      existingCart[itemIndex].quantity += 1;
    } else {
      // Item does not exist, add new item with quantity 1
      existingCart.push({
        ...item,
        quantity: 1
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  // Filter menu items by active category and search term
  useEffect(() => {
    if (!menuItems) return;
    
    const filtered = menuItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && matchesCategory;
    });
    
    setDisplayItems(filtered);
  }, [activeCategory, searchTerm, menuItems]);

  // Ensure items are displayed when the component first loads
  useEffect(() => {
    if (menuItems) {
      setDisplayItems(menuItems);
    }
  }, [menuItems]);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveCategory('all');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-restaurant-green"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Menu</h2>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

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
              {activeCategory === 'all' && !searchTerm && (
                <div className="mb-10">
                  <MenuGrid
                    items={menuItems?.filter(item => item.featured) || []}
                    activeCategory={activeCategory}
                    onAddToCart={handleAddToCart}
                    onClearFilters={handleClearFilters}
                    showFeatured={true}
                  />
                </div>
              )}

              {/* Regular menu items */}
              <motion.div
                key={activeCategory + searchTerm}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="border-b-2 border-restaurant-terracotta pb-1">
                    {activeCategory === 'all' ? 'All Menu Items' : categories.find(cat => cat.id === activeCategory)?.name}
                  </span>
                  <span className="ml-3 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {displayItems.filter(item => activeCategory === 'all' ? !item.featured || searchTerm : true).length} items
                  </span>
                </h2>
                
                <MenuGrid
                  items={displayItems}
                  activeCategory={activeCategory}
                  onAddToCart={handleAddToCart}
                  onClearFilters={handleClearFilters}
                  showFeatured={false}
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
