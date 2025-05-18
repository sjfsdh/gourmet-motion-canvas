
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  category?: string;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Generate a unique cart ID for the current browser session
  const getCartId = () => {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      cartId = `cart_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cartId', cartId);
    }
    return cartId;
  };
  
  // Get the cart storage key - either user-specific or session-specific
  const getCartStorageKey = () => {
    return user ? `cart_${user.id}` : `cart_${getCartId()}`;
  };
  
  useEffect(() => {
    // Load cart from localStorage on mount
    try {
      const cartKey = getCartStorageKey();
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      // Reset cart if there's an error
      localStorage.setItem(getCartStorageKey(), JSON.stringify([]));
      setCart([]);
    }
    
    setIsLoading(false);
  }, [user]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(getCartStorageKey(), JSON.stringify(cart));
    }
  }, [cart, isLoading, user]);
  
  // Add item to cart
  const addToCart = (item: any, quantity = 1) => {
    if (!item) {
      console.error('Attempted to add undefined item to cart');
      return;
    }
    
    // Extract only the fields we need from the item
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || '',
      quantity: quantity,
      description: item.description,
      category: item.category
    };
    
    setCart(currentCart => {
      // Check if item already exists
      const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Item doesn't exist, add new item
        return [...currentCart, cartItem];
      }
    });
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };
  
  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    });
  };
  
  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart(currentCart => 
      currentCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };
  
  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate total number of items
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
    isLoading,
  };
};
