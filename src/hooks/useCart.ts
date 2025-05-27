
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
  
  // Generate a unique cart ID for the current browser session using MAC/IP simulation
  const getCartId = () => {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      // Simulate MAC address based approach using browser fingerprint
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx!.textBaseline = 'top';
      ctx!.font = '14px Arial';
      ctx!.fillText('Browser fingerprint', 2, 2);
      const fingerprint = canvas.toDataURL();
      cartId = `cart_${btoa(fingerprint).slice(0, 12)}`;
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
        // Ensure we only load valid cart items
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          setCart([]);
        }
      } else {
        // For new users, ensure cart is empty
        setCart([]);
      }
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      // Reset cart if there's an error
      setCart([]);
      localStorage.removeItem(getCartStorageKey());
    }
    
    setIsLoading(false);
  }, [user]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const cartKey = getCartStorageKey();
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, isLoading, user]);
  
  // Add item to cart
  const addToCart = (item: any, quantity = 1) => {
    if (!item) {
      console.error('Attempted to add undefined item to cart');
      return;
    }
    
    console.log('Adding item to cart:', item);
    
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
        console.log('Updated existing item quantity:', updatedCart[existingItemIndex]);
        return updatedCart;
      } else {
        // Item doesn't exist, add new item
        console.log('Adding new item to cart:', cartItem);
        return [...currentCart, cartItem];
      }
    });
    
    // Show toast message
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    });
  };
  
  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
      duration: 2000,
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
      duration: 2000,
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
