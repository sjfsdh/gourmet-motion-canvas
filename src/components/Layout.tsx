
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { itemCount } = useCart();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLoginClick = () => {
    navigate('/auth');
  };
  
  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/95 shadow-md backdrop-blur-sm py-2" 
            : "bg-white py-3"
        }`}
      >
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="container-custom flex justify-between items-center"
        >
          <Link to="/" className="flex items-center">
            <motion.div
              variants={itemVariants}
              className="text-xl md:text-2xl font-bold text-blue-600 font-sans"
            >
              Distinct<span className="text-restaurant-terracotta">Gyrro</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <motion.nav 
            variants={itemVariants}
            className="hidden md:flex items-center space-x-8"
          >
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to={link.path}
                  className={`text-gray-700 hover:text-blue-600 transition-colors duration-300 text-sm font-medium ${
                    location.pathname === link.path ? "text-blue-600" : ""
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Desktop Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="hidden md:flex items-center space-x-5"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Search size={20} />
            </motion.button>
            <Link to="/cart" className="text-gray-700 hover:text-blue-600 transition-colors relative">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link to="/account" className="text-gray-700 hover:text-blue-600 transition-colors">
                <User size={20} />
              </Link>
            ) : (
              <CustomButton size="sm" onClick={handleLoginClick}>
                Login
              </CustomButton>
            )}
            {isAdmin && (
              <CustomButton size="sm" onClick={handleAdminClick} variant="outline">
                Admin
              </CustomButton>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="text-gray-700 hover:text-blue-600 relative">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white shadow-lg"
            >
              <div className="container-custom py-4 flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2 border-b border-gray-100 ${
                      location.pathname === link.path ? "text-blue-600 font-medium" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {user ? (
                  <Link 
                    to="/account" 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2 border-b border-gray-100 flex items-center"
                  >
                    <User size={18} className="mr-2" /> My Account
                  </Link>
                ) : (
                  <button 
                    onClick={handleLoginClick}
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2 border-b border-gray-100 flex items-center"
                  >
                    <User size={18} className="mr-2" /> Login
                  </button>
                )}
                {isAdmin && (
                  <div className="pt-3">
                    <CustomButton size="sm" className="w-full justify-center" onClick={handleAdminClick}>
                      Admin Dashboard
                    </CustomButton>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-10">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">DistinctGyrro</h3>
              <p className="text-gray-300 text-sm mb-6">Exceptional Mediterranean cuisine with fresh ingredients and innovative recipes.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/account" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                    My Account
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-4">Opening Hours</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 10:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 11:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 9:00 PM</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-4">Contact Us</h3>
              <address className="not-italic text-sm text-gray-300">
                <p className="mb-2">123 Mediterranean Street</p>
                <p className="mb-2">Foodie District</p>
                <p className="mb-2">New York, NY 10001</p>
                <p className="mb-2">
                  <a href="tel:+12125551234" className="hover:text-blue-400 transition-colors">+1 (212) 555-1234</a>
                </p>
                <p className="mb-2">
                  <a href="mailto:info@distinctgyrro.com" className="hover:text-blue-400 transition-colors">info@distinctgyrro.com</a>
                </p>
              </address>
            </div>
          </motion.div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} DistinctGyrro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
