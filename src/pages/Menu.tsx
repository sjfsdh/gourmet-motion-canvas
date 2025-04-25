
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BarChart, FilterX } from 'lucide-react';
import AnimatedSection from '@/components/animations/AnimatedSection';
import StaggeredItems from '@/components/animations/StaggeredItems';
import { useToast } from '@/hooks/use-toast';

// Menu categories
const categories = [
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
    category: 'starters'
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
    category: 'mains'
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
    category: 'desserts'
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
  const [activeCategory, setActiveCategory] = useState('starters');
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { toast } = useToast();
  
  // Filter menu items by active category
  const filteredItems = menuItems.filter(item => item.category === activeCategory);
  
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setMobileCategoryOpen(false);
    
    // Scroll to the category section
    if (categoryRefs.current[categoryId]) {
      categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleAddToCart = (item: typeof menuItems[0]) => {
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <div>
      {/* Menu Header */}
      <section className="bg-restaurant-green text-white py-20">
        <div className="container-custom text-center">
          <AnimatedSection animation="fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
            <p className="max-w-2xl mx-auto text-lg text-white/80">
              Savor our carefully crafted dishes, made with passion and the finest ingredients.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Category Menu Button */}
          <div className="md:hidden mb-4">
            <button 
              className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
              onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
            >
              <span className="font-medium">{categories.find(cat => cat.id === activeCategory)?.name || 'Select Category'}</span>
              <BarChart size={20} />
            </button>
            
            <AnimatePresence>
              {mobileCategoryOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white mt-2 rounded-lg shadow-md overflow-hidden"
                >
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`block w-full text-left px-4 py-3 transition-colors ${
                        activeCategory === category.id
                          ? 'bg-restaurant-green text-white'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Category Sidebar */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-restaurant-green text-white">
                <h2 className="text-xl font-semibold">Categories</h2>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeCategory === category.id
                            ? 'bg-restaurant-green text-white'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-grow">
            {categories.map((category) => (
              <div 
                key={category.id}
                id={category.id}
                ref={el => categoryRefs.current[category.id] = el}
                className={activeCategory === category.id ? '' : 'hidden'}
              >
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
                    <span className="border-b-2 border-restaurant-terracotta pb-2">{category.name}</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StaggeredItems animation="fadeIn">
                      {menuItems
                        .filter(item => item.category === category.id)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover-scale"
                          >
                            <div className="h-48 overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-5 flex-grow flex flex-col">
                              <div className="mb-2 flex justify-between items-start">
                                <h3 className="text-xl font-semibold">{item.name}</h3>
                                <div className="text-xl font-bold text-restaurant-green">${item.price.toFixed(2)}</div>
                              </div>
                              <p className="text-gray-600 mb-4 flex-grow line-clamp-2">{item.description}</p>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-secondary flex items-center justify-center"
                                onClick={() => handleAddToCart(item)}
                              >
                                <Plus size={18} className="mr-1" /> Add to Cart
                              </motion.button>
                            </div>
                          </div>
                        ))}
                    </StaggeredItems>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
