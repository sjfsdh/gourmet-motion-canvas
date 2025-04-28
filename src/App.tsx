import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import { initializeDatabase, seedDatabaseIfEmpty } from "./services/dbInitService";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import MenuManager from "./pages/Admin/MenuManager";
import CategoryManager from "./pages/Admin/CategoryManager";
import OrderManager from "./pages/Admin/OrderManager";
import GalleryManager from "./pages/Admin/GalleryManager";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminAuth from "./pages/Admin/AdminAuth";
import AdminProfile from "./pages/Admin/AdminProfile";

// Create a ProtectedRoute component for admin access
const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  // Check if admin token exists in localStorage
  const isAdminLoggedIn = localStorage.getItem('adminToken') !== null;
  
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

const queryClient = new QueryClient();

// Initialize the database
const initDB = async () => {
  try {
    console.log("Initializing database...");
    await initializeDatabase();
    await seedDatabaseIfEmpty();
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
};

// Component to handle database initialization
const DatabaseInitializer = ({ children }: { children: React.ReactNode }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initDB();
      } catch (error) {
        console.error("Database initialization failed, continuing with app:", error);
      } finally {
        // Always set to initialized, even if there was an error
        // This ensures the app continues to work in browser environments
        setInitialized(true);
      }
    };

    init();
  }, []);

  if (!initialized) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-restaurant-green border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg font-medium">Loading application...</p>
      </div>
    </div>;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DatabaseInitializer>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/menu" element={<Layout><Menu /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account" element={<Layout><Account /></Layout>} />
            
            {/* Admin Auth Route */}
            <Route path="/admin/login" element={<AdminAuth />} />
            
            {/* Admin Routes - Protected */}
            <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="menu" element={<MenuManager />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DatabaseInitializer>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
