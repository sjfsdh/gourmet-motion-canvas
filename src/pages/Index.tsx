
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import HeroBanner from '@/components/HeroBanner';
import FeatureCard from '@/components/FeatureCard';
import { SectionTitle } from '@/components/ui/section-title';
import { CustomButton } from '@/components/ui/custom-button';
import { getFeaturedMenuItems } from '@/services/menuService';
import { useCart } from '@/hooks/useCart';
import { useRestaurantName } from '@/hooks/useRestaurantName';

const Index = () => {
  const { addToCart } = useCart();
  const { restaurantName } = useRestaurantName();
  
  // Fetch featured menu items
  const { data: featuredItems = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['featuredMenuItems'],
    queryFn: getFeaturedMenuItems
  });

  const features = [
    {
      icon: <Star className="w-8 h-8" />,
      title: "Premium Quality",
      description: "Fresh ingredients sourced daily from local Mediterranean markets"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Fast Service",
      description: "Quick preparation without compromising on taste and quality"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Prime Location",
      description: "Conveniently located in the heart of the foodie district"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleAddToCart = (item: any) => {
    addToCart(item);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroBanner
        title={`Welcome to ${restaurantName}`}
        subtitle="Experience the authentic taste of the Mediterranean with our freshly prepared gyros, kebabs, and traditional dishes"
        backgroundImage="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3"
        primaryCta={{
          text: "Order Now",
          link: "/menu"
        }}
        secondaryCta={{
          text: "View Menu",
          link: "/menu"
        }}
      />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Why Choose Us" 
            subtitle="Experience the authentic taste of the Mediterranean"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-16 bg-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Featured Items" 
            subtitle="Try our most popular dishes"
          />
          
          {featuredLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-restaurant-green"></div>
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured items available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-restaurant-terracotta text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-restaurant-terracotta transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-2xl font-bold text-restaurant-green">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex space-x-3">
                      <CustomButton
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-restaurant-terracotta hover:bg-restaurant-terracotta/90"
                        disabled={!item.in_stock}
                      >
                        {item.in_stock ? 'Add to Cart' : 'Out of Stock'}
                      </CustomButton>
                      <Link to="/menu">
                        <CustomButton variant="outline" className="px-6">
                          Order Now
                        </CustomButton>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/menu">
              <CustomButton size="lg" className="px-8">
                View Full Menu
                <ArrowRight className="ml-2 w-5 h-5" />
              </CustomButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-restaurant-green text-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience {restaurantName}?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Order now and taste the authentic flavors of the Mediterranean
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu">
                <CustomButton 
                  size="lg" 
                  className="bg-white text-restaurant-green hover:bg-gray-100 px-8"
                >
                  Order Online
                </CustomButton>
              </Link>
              <Link to="/contact">
                <CustomButton 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-restaurant-green px-8"
                >
                  Visit Us
                </CustomButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
