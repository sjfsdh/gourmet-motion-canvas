
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  FileText, 
  ShoppingCart, 
  Image, 
  Settings, 
  LogOut,
  User,
  ChevronDown,
  Bell,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, isAdmin } = useAuth();
  
  // Check if admin token exists
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  }, [navigate]);
  
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Menu Management', path: '/admin/menu', icon: FileText },
    { name: 'Category Management', path: '/admin/categories', icon: Tag },
    { name: 'Order Management', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Gallery Management', path: '/admin/gallery', icon: Image },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];
  
  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate('/admin/login');
  };
  
  // Get admin user data
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{"name":"Admin User","email":"admin@example.com"}');
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-restaurant-green mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <motion.aside 
        className={`bg-gray-900 text-white w-64 fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <Link to="/admin" className="text-xl font-bold text-white">
              DistinctGyrro Admin
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon size={20} className="mr-3" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-400 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 lg:ml-64">
        {/* Navbar */}
        <header className="bg-white shadow z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>
              <h1 className="ml-4 lg:ml-0 text-lg font-semibold text-gray-800">
                {menuItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="relative text-gray-500 hover:text-gray-700"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>
              
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                    <User size={16} />
                  </div>
                  <span className="ml-2 mr-1 hidden sm:block">{adminUser?.name || 'Admin User'}</span>
                  <ChevronDown size={16} />
                </motion.button>

                {profileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  >
                    <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children || <Outlet />}
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></motion.div>
      )}
    </div>
  );
};

export default AdminLayout;
