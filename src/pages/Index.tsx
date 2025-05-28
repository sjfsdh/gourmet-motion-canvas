
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ChevronLeft, ChevronRight, MapPin, Clock, Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AnimatedSection from '@/components/animations/AnimatedSection';
import StaggeredItems from '@/components/animations/StaggeredItems';
import HeroBanner from '@/components/HeroBanner';
import FeatureCard from '@/components/FeatureCard';
import SectionTitle from '@/components/ui/section-title';
import { CustomButton } from '@/components/ui/custom-button';
import MenuGrid from '@/components/menu/MenuGrid';
import { getAllMenuItems, getFeaturedMenuItems } from '@/services/menuService';

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

  // Fetch featured menu items from database
  const { data: featuredItems = [], isLoading: featuredLoading, error: featuredError } = useQuery({
    queryKey: ['featuredMenuItems'],
    queryFn: getFeaturedMenuItems
  });

  // Fetch all menu items for display
  const { data: allMenuItems = [], isLoading: menuLoading, error: menuError } = useQuery({
    queryKey: ['allMenuItems'],
    queryFn: getAllMenuItems
  });

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

  const clearFilters = () => {
    // No-op function for MenuGrid
  };

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner 
        title="Authentic Mediterranean Cuisine"
        subtitle="Experience the fresh, bold flavors of the Mediterranean with our carefully crafted dishes and warm hospitality."
        backgroundImage="https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
        primaryCta={{
          text: "View Menu",
          link: "/menu"
        }}
        secondaryCta={{
          text: "Order Now",
          link: "/menu"
        }}
      />

      {/* Featured Dishes - Using real database data */}
      <section className="section-padding bg-gradient-light">
        <div className="container-custom">
          <SectionTitle 
            title="Featured Dishes"
            subtitle="Discover our chef's specially curated selection of Mediterranean favorites"
            animation="slideUp"
          />

          <AnimatedSection animation="fadeIn">
            <MenuGrid 
              items={featuredItems} 
              activeCategory="all" 
              onClearFilters={clearFilters}
              showFeatured={true}
              columns={4}
              isLoading={featuredLoading}
              error={featuredError}
            />
          </AnimatedSection>

          <div className="text-center mt-12">
            <CustomButton variant="outline">
              <Link to="/menu" className="flex items-center gap-2">
                View Full Menu <ArrowRight size={18} />
              </Link>
            </CustomButton>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle
            title="Why Choose Us"
            subtitle="We pride ourselves on delivering authentic Mediterranean excellence in every aspect"
            animation="slideUp"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Fresh Ingredients"
              description="We select only the freshest, highest quality ingredients from trusted local suppliers to ensure every dish is exceptional."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
              delay={0.2}
            />

            <FeatureCard 
              title="Authentic Recipes"
              description="Our team of talented chefs brings decades of experience and traditional Mediterranean cooking techniques to every dish."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              }
              delay={0.4}
            />

            <FeatureCard 
              title="Great Atmosphere"
              description="Every detail of our restaurant is carefully considered to create an unforgettable dining experience that engages all your senses."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              }
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Popular Menu Items */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionTitle 
            title="Popular Menu Items"
            subtitle="Try our most loved dishes that keep customers coming back"
            animation="slideUp"
          />

          <AnimatedSection animation="fadeIn">
            <MenuGrid 
              items={allMenuItems.slice(0, 6)} 
              activeCategory="all" 
              onClearFilters={clearFilters}
              showFeatured={false}
              columns={3}
              isLoading={menuLoading}
              error={menuError}
            />
          </AnimatedSection>

          <div className="text-center mt-12">
            <CustomButton>
              <Link to="/menu" className="flex items-center gap-2">
                Explore Full Menu <ArrowRight size={18} />
              </Link>
            </CustomButton>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-blue-600 text-white">
        <div className="container-custom">
          <AnimatedSection animation="fadeIn">
            <SectionTitle
              title="What Our Guests Say"
              subtitle="Our guests' experiences speak for themselves"
              titleClassName="text-white"
              subtitleClassName="text-white/80"
            />
          </AnimatedSection>

          <div className="max-w-4xl mx-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white/20">
                    <img 
                      src={testimonials[currentTestimonial].image} 
                      alt={testimonials[currentTestimonial].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={20} fill="#FFD700" color="#FFD700" />
                    ))}
                    {[...Array(5 - testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i + testimonials[currentTestimonial].rating} size={20} color="white" />
                    ))}
                  </div>
                  
                  <p className="text-xl mb-6 italic">"{testimonials[currentTestimonial].text}"</p>
                  
                  <h3 className="text-xl font-semibold">{testimonials[currentTestimonial].name}</h3>
                  <p className="text-white/80">{testimonials[currentTestimonial].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-6">
              <motion.button 
                onClick={prevTestimonial}
                className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </motion.button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      currentTestimonial === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  ></button>
                ))}
              </div>
              
              <motion.button 
                onClick={nextTestimonial}
                className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="section-padding bg-gradient-subtle">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slideInLeft">
              <div className="rounded-xl overflow-hidden h-96 shadow-lg">
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gradient">Location & Hours</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="mr-4 text-blue-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Our Address</h3>
                    <address className="not-italic text-gray-600">
                      <p>123 Mediterranean Street</p>
                      <p>Foodie District</p>
                      <p>New York, NY 10001</p>
                    </address>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 text-blue-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Opening Hours</h3>
                    <div className="text-gray-600">
                      <p>Monday - Friday: 8:00 AM - 10:00 PM</p>
                      <p>Saturday: 9:00 AM - 11:00 PM</p>
                      <p>Sunday: 10:00 AM - 9:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 text-blue-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Contact</h3>
                    <div className="text-gray-600">
                      <p>Phone: <a href="tel:+12125551234" className="text-link">+1 (212) 555-1234</a></p>
                      <p>Email: <a href="mailto:info@distinctgyrro.com" className="text-link">info@distinctgyrro.com</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-3xl text-center">
          <AnimatedSection animation="slideUp">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Mediterranean Community</h2>
            <p className="text-gray-600 mb-8">Subscribe to our newsletter and be the first to know about seasonal menus, special events, and exclusive offers.</p>
            
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-500 text-white p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold mb-2">Thank You for Subscribing!</h3>
                <p>We've sent a welcome email to your inbox. Looking forward to sharing our culinary journey with you.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <CustomButton type="submit">
                  Subscribe
                </CustomButton>
              </form>
            )}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
