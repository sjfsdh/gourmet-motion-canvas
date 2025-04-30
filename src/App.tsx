import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LazyMotion, domMax } from "framer-motion";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
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

// Create a queryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create Protected Route component for admin routes
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if admin token exists in localStorage
    const adminToken = localStorage.getItem('adminToken');
    setIsAuthenticated(!!adminToken);
  }, []);
  
  if (isAuthenticated === null) {
    // Still loading
    return <div>Loading...</div>;
  }
  
  if (isAuthenticated === false) {
    // Not authenticated, redirect to login
    return <Navigate to="/admin/login" />;
  }
  
  // Authenticated, render children
  return <>{children}</>;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize database
        await initializeDatabase();
        // Seed database if empty
        await seedDatabaseIfEmpty();
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-restaurant-green mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading DistinctGyrro...</p>
        </div>
      </div>
    );
  }

  return (
    <LazyMotion features={domMax}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Main website routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="menu" element={<Menu />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="account" element={<Account />} />
                <Route path="auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminAuth />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="menu" element={<MenuManager />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="orders" element={<OrderManager />} />
                <Route path="gallery" element={<GalleryManager />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>
            </Routes>

            <Toaster />
            <Sonner position="top-right" />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </LazyMotion>
  );
}

export default App;
