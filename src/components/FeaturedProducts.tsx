
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, DollarSign } from 'lucide-react';
import { CustomButton } from './ui/custom-button';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  prepTime: string;
  isPopular?: boolean;
}

const FeaturedProducts = () => {
  const featuredProducts: Product[] = [
    {
      id: 1,
      name: "Classic Gyro",
      description: "Traditional Greek gyro with tender lamb, fresh vegetables, and our signature tzatziki sauce",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.8,
      prepTime: "10-15 min",
      isPopular: true
    },
    {
      id: 2,
      name: "Mediterranean Bowl",
      description: "Fresh quinoa bowl with grilled chicken, hummus, olives, and Mediterranean vegetables",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.7,
      prepTime: "12-18 min"
    },
    {
      id: 3,
      name: "Chicken Souvlaki",
      description: "Marinated chicken skewers with Greek seasoning, served with pita and cucumber sauce",
      price: 13.99,
      image: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.9,
      prepTime: "15-20 min",
      isPopular: true
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Featured Dishes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular Mediterranean delicacies, crafted with authentic ingredients and traditional recipes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.isPopular && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-700">
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="ml-1 text-sm">{product.prepTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-restaurant-green">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-xl font-bold">{product.price}</span>
                  </div>
                  <CustomButton size="sm" className="px-4">
                    Add to Cart
                  </CustomButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link to="/menu">
            <CustomButton size="lg" variant="outline" className="px-8">
              View Full Menu
            </CustomButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
