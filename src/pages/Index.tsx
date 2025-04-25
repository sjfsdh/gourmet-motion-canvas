
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ChevronLeft, ChevronRight, MapPin, Clock, Phone } from 'lucide-react';
import AnimatedSection from '@/components/animations/AnimatedSection';
import StaggeredItems from '@/components/animations/StaggeredItems';

// Mock data for featured dishes
const featuredDishes = [
  {
    id: 1,
    name: 'Truffle Risotto',
    description: 'Creamy arborio rice with wild mushrooms and black truffle',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Mains'
  },
  {
    id: 2,
    name: 'Herb-Crusted Salmon',
    description: 'Fresh Atlantic salmon with a crispy herb crust and lemon butter sauce',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Mains'
  },
  {
    id: 3,
    name: 'Chocolate Fondant',
    description: 'Warm chocolate cake with a molten center and vanilla ice cream',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Desserts'
  },
  {
    id: 4,
    name: 'Signature Cocktail',
    description: 'House-infused botanicals with premium spirits and fresh citrus',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Drinks'
  }
];

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Critic',
    text: 'An exquisite dining experience. The flavors are bold yet perfectly balanced, and the service is impeccable.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Regular Customer',
    text: 'Every visit feels special. They remember my preferences and always suggest new dishes that match my taste perfectly.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    rating: 5
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Local Foodie',
    text: 'The most innovative cuisine in town. Their seasonal menu is always surprising and delightful.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    rating: 4
  }
];

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [showPopupOffer, setShowPopupOffer] = useState(false);

  // Show popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopupOffer(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Restaurant ambiance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="container-custom relative z-10 text-white text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
          >
            Exceptional Cuisine
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex justify-center"
          >
            <div className="h-1 w-24 bg-restaurant-terracotta my-4"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
          >
            Elevate your dining experience with our masterfully crafted dishes and impeccable service.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/menu" className="btn-primary flex items-center justify-center gap-2">
              View Menu <ArrowRight size={18} />
            </Link>
            <Link to="/menu" className="btn-secondary flex items-center justify-center gap-2">
              Order Now <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="section-padding bg-restaurant-cream">
        <div className="container-custom">
          <AnimatedSection animation="slideUp">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Featured Dishes</h2>
            <p className="text-center text-gray-600 mb-12">Discover our chef's specially curated selection</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StaggeredItems animation="slideUp">
              {featuredDishes.map((dish) => (
                <div 
                  key={dish.id} 
                  className="card group overflow-hidden hover-scale"
                >
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={dish.image} 
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
                        <span className="text-sm text-restaurant-terracotta mb-3 inline-block">{dish.category}</span>
                      </div>
                      <div className="text-xl font-bold text-restaurant-green">${dish.price}</div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{dish.description}</p>
                    <Link 
                      to="/menu" 
                      className="inline-flex items-center text-restaurant-green font-medium hover:underline"
                    >
                      Order Now <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </StaggeredItems>
          </div>

          <div className="text-center mt-12">
            <Link to="/menu" className="btn-outline">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimatedSection animation="slideUp">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Why Choose Us</h2>
            <p className="text-center text-gray-600 mb-12">We pride ourselves on delivering excellence in every aspect</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection delay={0.2} animation="slideUp" className="text-center p-6">
              <div className="bg-restaurant-cream rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-restaurant-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Ingredients</h3>
              <p className="text-gray-600">We select only the freshest, highest quality ingredients from trusted local suppliers to ensure every dish is exceptional.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.4} animation="slideUp" className="text-center p-6">
              <div className="bg-restaurant-cream rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-restaurant-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Culinary Expertise</h3>
              <p className="text-gray-600">Our team of talented chefs brings decades of experience and passion, creating innovative dishes that delight the senses.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.6} animation="slideUp" className="text-center p-6">
              <div className="bg-restaurant-cream rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-restaurant-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Memorable Experience</h3>
              <p className="text-gray-600">Every detail is carefully considered to create an unforgettable dining experience that engages all your senses.</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-restaurant-green text-white">
        <div className="container-custom">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">What Our Guests Say</h2>
            <p className="text-center text-white/80 mb-12">Our guests' experiences speak for themselves</p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto relative">
            <AnimatedSection key={currentTestimonial} animation="fadeIn">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-restaurant-terracotta">
                  <img 
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#E3B23C" color="#E3B23C" />
                  ))}
                  {[...Array(5 - testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i + testimonials[currentTestimonial].rating} size={20} />
                  ))}
                </div>
                
                <p className="text-xl mb-6 italic">"{testimonials[currentTestimonial].text}"</p>
                
                <h3 className="text-xl font-semibold">{testimonials[currentTestimonial].name}</h3>
                <p className="text-white/80">{testimonials[currentTestimonial].role}</p>
              </div>
            </AnimatedSection>

            <div className="flex justify-between mt-6">
              <button 
                onClick={prevTestimonial}
                className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors duration-300"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      currentTestimonial === index ? 'bg-restaurant-terracotta' : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  ></button>
                ))}
              </div>
              
              <button 
                onClick={nextTestimonial}
                className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors duration-300"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slideInLeft">
              <div className="rounded-lg overflow-hidden h-96">
                <iframe 
                  title="Restaurant Location"
                  className="w-full h-full border-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.982750303956!2d-73.98825238459395!3d40.74844097932718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzUzLjQiTiA3M8KwNTknMTUuMyJX!5e0!3m2!1sen!2sus!4v1554517275237!5m2!1sen!2sus"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideInRight">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Location & Hours</h2>
              
              <div className="flex items-start mb-6">
                <div className="mr-4 text-restaurant-green">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Our Address</h3>
                  <address className="not-italic text-gray-600">
                    <p>123 Gourmet Street</p>
                    <p>Foodie District</p>
                    <p>New York, NY 10001</p>
                  </address>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="mr-4 text-restaurant-green">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Opening Hours</h3>
                  <div className="text-gray-600">
                    <p>Monday - Friday: 8:00 AM - 10:00 PM</p>
                    <p>Saturday: 9:00 AM - 11:00 PM</p>
                    <p>Sunday: 10:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 text-restaurant-green">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Contact</h3>
                  <div className="text-gray-600">
                    <p>Phone: <a href="tel:+12125551234" className="hover:text-restaurant-green">+1 (212) 555-1234</a></p>
                    <p>Email: <a href="mailto:info@gourmettable.com" className="hover:text-restaurant-green">info@gourmettable.com</a></p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-restaurant-cream">
        <div className="container-custom max-w-3xl text-center">
          <AnimatedSection animation="slideUp">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Culinary Community</h2>
            <p className="text-gray-600 mb-8">Subscribe to our newsletter and be the first to know about seasonal menus, special events, and exclusive offers.</p>
            
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-restaurant-green text-white p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold mb-2">Thank You for Subscribing!</h3>
                <p>We've sent a welcome email to your inbox. Looking forward to sharing our culinary journey with you.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-restaurant-green"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn-primary"
                >
                  Subscribe
                </motion.button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Special Offer Popup */}
      <AnimatePresence>
        {showPopupOffer && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
          >
            <div className="bg-white rounded-lg shadow-xl p-6 border border-restaurant-green/20">
              <button 
                onClick={() => setShowPopupOffer(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-restaurant-green mb-3">First-Time Visitor?</h3>
              <p className="mb-4">Enjoy 15% off your first order with code:</p>
              <div className="bg-restaurant-cream p-3 rounded text-center font-bold text-restaurant-charcoal mb-4">
                WELCOME15
              </div>
              <Link to="/menu" className="btn-primary w-full block text-center">
                Order Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
