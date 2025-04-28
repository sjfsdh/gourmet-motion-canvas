
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { useToast } from '@/hooks/use-toast';
import MenuSearch from '@/components/menu/MenuSearch';
import CategoryFilter from '@/components/menu/CategoryFilter';
import MenuGrid from '@/components/menu/MenuGrid';

// Menu categories
const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'starters', name: 'Starters' },
  { id: 'mains', name: 'Mains' },
  { id: 'sides', name: 'Sides' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Drinks' }
];

// Menu items
const menuItems = [
  {
    id: 1,
    name: 'Burrata Salad',
    description: 'Fresh burrata cheese with heirloom tomatoes, basil, and aged balsamic.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'starters',
    featured: true
  },
  {
    id: 2,
    name: 'Truffle Arancini',
    description: 'Crispy risotto balls with wild mushrooms, truffle, and parmesan.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604135307399-86c3e6035d13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'starters'
  },
  {
    id: 3,
    name: 'Beef Carpaccio',
    description: 'Thinly sliced raw beef with arugula, capers, truffle oil, and parmesan.',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'starters'
  },
  {
    id: 4,
    name: 'Filet Mignon',
    description: '8oz prime beef tenderloin with red wine reduction and roasted vegetables.',
    price: 42.99,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'mains',
    featured: true
  },
  {
    id: 5,
    name: 'Herb-Crusted Salmon',
    description: 'Fresh Atlantic salmon with a crispy herb crust and lemon butter sauce.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'mains'
  },
  {
    id: 6,
    name: 'Truffle Risotto',
    description: 'Creamy arborio rice with wild mushrooms and black truffle.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'mains'
  },
  {
    id: 7,
    name: 'Duck Confit',
    description: 'Slow-cooked duck leg with crispy skin, served with cherry sauce.',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'mains'
  },
  {
    id: 8,
    name: 'Truffle Fries',
    description: 'Crispy fries tossed with parmesan, truffle oil, and fresh herbs.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'sides'
  },
  {
    id: 9,
    name: 'Roasted Brussels Sprouts',
    description: 'Brussels sprouts roasted with bacon, maple syrup, and balsamic glaze.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1584615467033-75627d04a3e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'sides'
  },
  {
    id: 10,
    name: 'Chocolate Fondant',
    description: 'Warm chocolate cake with a molten center and vanilla ice cream.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'desserts',
    featured: true
  },
  {
    id: 11,
    name: 'Crème Brûlée',
    description: 'Classic French custard with caramelized sugar crust.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'desserts'
  },
  {
    id: 12,
    name: 'Tiramisu',
    description: 'Espresso-soaked ladyfingers layered with mascarpone cream.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'desserts'
  },
  {
    id: 13,
    name: 'Signature Cocktail',
    description: 'House-infused botanicals with premium spirits and fresh citrus.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'drinks'
  },
  {
    id: 14,
    name: 'Aged Wine Collection',
    description: 'Selection of our finest aged wines from around the world.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78a0b98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'drinks'
  },
  {
    id: 15,
    name: 'Artisanal Coffee',
    description: 'Locally roasted premium coffee beans prepared to perfection.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'drinks'
  }
];

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayItems, setDisplayItems] = useState([]);
  const { toast } = useToast();
  
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
    const filtered = menuItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && matchesCategory;
    });
    
    setDisplayItems(filtered);
  }, [activeCategory, searchTerm]);

  // Ensure items are displayed when the component first loads
  useEffect(() => {
    setDisplayItems(menuItems);
  }, []);

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
              {activeCategory === 'all' && (
                <div className="mb-10">
                  <MenuGrid
                    items={displayItems}
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
                    {displayItems.filter(item => activeCategory === 'all' ? !item.featured : true).length} items
                  </span>
                </h2>
                
                <MenuGrid
                  items={displayItems}
                  activeCategory={activeCategory}
                  onAddToCart={handleAddToCart}
                  onClearFilters={handleClearFilters}
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
