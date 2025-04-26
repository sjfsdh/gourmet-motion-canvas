
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, X, Search } from 'lucide-react';
import AnimatedSection from '@/components/animations/AnimatedSection';
import StaggeredItems from '@/components/animations/StaggeredItems';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CustomButton } from '@/components/ui/custom-button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  const { toast } = useToast();
  
  // Filter menu items by active category and search term
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const handleAddToCart = (item: typeof menuItems[0]) => {
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

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
            
            {/* Desktop search bar */}
            <div className="max-w-md mx-auto relative hidden md:block">
              <input
                type="text"
                placeholder="Search our menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Search className="absolute right-4 top-3 text-white/70" size={20} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container-custom py-12">
        {/* Mobile search bar */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search our menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-restaurant-green/30"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Category Filter Button */}
          <div className="lg:hidden mb-4">
            <button 
              className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
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
                    onValueChange={setActiveCategory}
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

          {/* Desktop Category Sidebar */}
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
                  onValueChange={setActiveCategory}
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

          {/* Menu Items Grid */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchTerm}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {filteredItems.length > 0 ? (
                  <>
                    {/* Featured items at the top for "All" category */}
                    {activeCategory === 'all' && (
                      <div className="mb-10">
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                          <span className="border-b-2 border-restaurant-terracotta pb-1">Featured Items</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredItems.filter(item => item.featured).map((item) => (
                            <motion.div
                              key={item.id}
                              layout
                              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                            >
                              <div className="relative h-48 overflow-hidden">
                                <motion.img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ duration: 0.4 }}
                                />
                                <div className="absolute top-3 right-3 bg-restaurant-terracotta text-white px-3 py-1 rounded-full text-xs font-medium">
                                  Featured
                                </div>
                              </div>
                              <div className="p-5">
                                <div className="mb-2 flex justify-between items-start">
                                  <h3 className="text-xl font-semibold">{item.name}</h3>
                                  <div className="text-xl font-bold text-restaurant-green">${item.price.toFixed(2)}</div>
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                                <CustomButton
                                  variant="secondary"
                                  className="w-full"
                                  onClick={() => handleAddToCart(item)}
                                  icon={<Plus size={18} />}
                                >
                                  Add to Cart
                                </CustomButton>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Regular menu items */}
                    <div>
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <span className="border-b-2 border-restaurant-terracotta pb-1">
                          {activeCategory === 'all' ? 'All Menu Items' : categories.find(cat => cat.id === activeCategory)?.name}
                        </span>
                        <span className="ml-3 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {filteredItems.filter(item => activeCategory === 'all' ? !item.featured : true).length} items
                        </span>
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StaggeredItems animation="fadeIn">
                          {filteredItems
                            .filter(item => activeCategory === 'all' ? !item.featured : true)
                            .map((item) => (
                              <motion.div
                                key={item.id}
                                layout
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                              >
                                <div className="h-48 overflow-hidden">
                                  <motion.img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                  />
                                </div>
                                <div className="p-5">
                                  <div className="mb-2 flex justify-between items-start">
                                    <h3 className="text-xl font-semibold">{item.name}</h3>
                                    <div className="text-xl font-bold text-restaurant-green">${item.price.toFixed(2)}</div>
                                  </div>
                                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                                  <CustomButton
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => handleAddToCart(item)}
                                    icon={<Plus size={18} />}
                                  >
                                    Add to Cart
                                  </CustomButton>
                                </div>
                              </motion.div>
                            ))}
                        </StaggeredItems>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No items found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
                    <CustomButton onClick={() => {setSearchTerm(''); setActiveCategory('all');}}>
                      Clear Filters
                    </CustomButton>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
